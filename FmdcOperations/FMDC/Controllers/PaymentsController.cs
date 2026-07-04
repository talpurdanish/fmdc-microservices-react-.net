using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.Context;
using FMDC.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System.Globalization;

namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    public class PaymentsController : Controller
    {
        private readonly FmdcOperationsContext _context;
        private readonly IConfiguration _config;
        private readonly INotificationService _notificationService;

        public PaymentsController(FmdcOperationsContext context, IConfiguration config, INotificationService notificationService)
        {
            _context = context;
            _config = config;
            _notificationService = notificationService;
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> CreatePaymentIntent(int id)
        {
            if (id <= 0)
            {
                return FmdcResult.Error("Invalid ID", 404);
            }
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return FmdcResult.Error("Unauthorized", 401);
            }

            var receipt = _context.Receipts.FirstOrDefault(r => r.Id == id);
            if (receipt == null || (receipt != null && receipt.Paid))
            {
                string errorMessage = receipt == null ? "Receipt not found" : "Receipt already paid";
                return FmdcResult.Error(errorMessage, 404);
            }
            else
            {
                long amountInCents = (long)(receipt!.GrandTotal * 100);

                var options = new PaymentIntentCreateOptions
                {
                    Amount = amountInCents,
                    Currency = "pkr",
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true,
                    },
                    Metadata = new Dictionary<string, string>
                    {
                        { "ReceiptId", receipt.Id.ToString(CultureInfo.InvariantCulture) },
                        { "UserId", currentUser!.Id.ToString(CultureInfo.InvariantCulture) }
                    }
                };

                var service = new PaymentIntentService();
                var intent = await service.CreateAsync(options);

                receipt.StripePaymentIntentId = intent.Id; // stable Id
                _context.Receipts.Update(receipt);
                await _context.SaveChangesAsync();


                return FmdcResult.Success(new { clientSecret = intent.ClientSecret }, 200);
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            string? endpointSecret = _config["Stripe:WebhookSecret"];
            if (endpointSecret is null)
            {
                return BadRequest(new { error = "Webhook Secret is not provided" });
            }

            try
            {
                var stripeEvent = EventUtility.ParseEvent(json,
                        throwOnApiVersionMismatch: false);
                var signatureHeader = Request.Headers["Stripe-Signature"];

                stripeEvent = EventUtility.ConstructEvent(json,
                        signatureHeader, endpointSecret,
                        throwOnApiVersionMismatch: false
                    );



                var intent = stripeEvent.Data.Object as PaymentIntent;
                if (intent != null)
                {
                    int? userId = -1;
                    if (intent.Metadata.TryGetValue("UserId", out var userIdStr) && userIdStr != null)
                    {
                        if (!int.TryParse(userIdStr, out int uId))
                            userId = null;
                        else
                            userId = uId;
                    }

                    // Prefer metadata for direct lookup
                    if (intent.Metadata.TryGetValue("ReceiptId", out var receiptIdStr) &&
                        int.TryParse(receiptIdStr, out var receiptId))
                    {
                        var receipt = await _context.Receipts.FirstOrDefaultAsync(r => r.Id == receiptId);
                        if (receipt != null)
                        {
                            if (stripeEvent.Type == EventTypes.PaymentIntentSucceeded)
                            {
                                receipt.Paid = true;
                                receipt.PaidAt = DateTime.UtcNow;
                                _context.Receipts.Update(receipt);
                                await _context.SaveChangesAsync();

                                await _notificationService.SendNotificationAsync(userId, new NotificationMessage
                                {
                                    Type = NotificationType.PaymentSucceeded,
                                    Severity = NotificationSeverity.Success,
                                    Message = "Payment confirmed for Receipt ID # " + receipt.Id.ToString("D8", CultureInfo.InvariantCulture) + " with amount PKR " + receipt.GrandTotal,
                                    Data = new { PaymentIntentId = intent.Id, Amount = receipt.GrandTotal },
                                    ShowMessage = true,
                                });
                            }
                            else if (stripeEvent.Type == EventTypes.PaymentIntentPaymentFailed)
                            {
                                receipt.StripePaymentIntentId = "";
                                _context.Entry(receipt).State = EntityState.Modified;
                                _context.Receipts.Update(receipt);
                                await _context.SaveChangesAsync();
                                await _notificationService.SendNotificationAsync(userId, new NotificationMessage
                                {
                                    Type = NotificationType.PaymentFailed,
                                    Severity = NotificationSeverity.Error,
                                    Message = "Payment failed for Receipt ID # " + receipt.Id.ToString("D8", CultureInfo.InvariantCulture) + " with amount PKR " + receipt.GrandTotal,
                                    Data = new { PaymentIntentId = intent.Id, Amount = receipt.GrandTotal },
                                    ShowMessage = true,
                                });
                            }

                        }
                    }
                }

                return Ok();
            }
            catch (StripeException e)
            {
                await _notificationService.SendNotificationAsync(null, new NotificationMessage
                {
                    Type = NotificationType.PaymentFailed,
                    Severity = NotificationSeverity.Error,
                    Message = "Payment you have recently made was not successful",
                    Data = new { },
                    ShowMessage = true,
                });
                return BadRequest(new { error = e.Message });
            }
        }

       

        private UserViewModel? GetCurrentUser()
        {
            return HttpContext.Items["User"] as UserViewModel;

        }
    }
}
