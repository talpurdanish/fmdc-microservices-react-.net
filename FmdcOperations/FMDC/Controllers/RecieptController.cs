using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;
using FMDC.Reports;
using FMDC.Security;
using FMDC.Security.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    public class ReceiptsController : ControllerBase
    {
        private readonly IReceiptService _service;
        private readonly IWebHostEnvironment _environment;

        public ReceiptsController(IReceiptService Manager,
            IWebHostEnvironment environment,
            IOptions<PayPalSettings> payPalSettings)
        {
            _service = Manager;
            _environment = environment;
        }
        // GET: api/<ReceiptsController>
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {

            try
            {
                var Receipts = await _service.GetReceipts(filter);

                return FmdcResult.Success("", Receipts, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Receipts could not be fetched" + e.Message, 500);
            }
        }

        // GET api/<ReceiptsController>/5
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ReceiptId is not valid", 500);
                var receipt = await _service.GetReceipt(id);
                return FmdcResult.Success(receipt, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Receipt does not exists" + e.Message, 500);
            }
        }

        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]")]
        public async Task<JsonResult> GetUnpaidReceipts([FromQuery] DataFilter filter)
        {
            try
            {
                var receipts = await _service.GetUnpaidReceipts(filter);
                return FmdcResult.Success("", receipts, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("receipts could not be fetched" + e.Message, 500);
            }
        }

        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]

        [HttpGet("[action]/{id}")]
        public async Task<JsonResult> GetPatientReceipts([FromQuery] DataFilter filter)
        {
            try
            {
                if (filter.Id <= 0)
                    return FmdcResult.Error("Id is not valid", 404);
                var receipts = await _service.GetPatientReceipts(filter);
                return FmdcResult.Success("", receipts, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("receipts could not be fetched" + e.Message, 500);
            }
        }

        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]

        [HttpGet("[action]/{id}")]
        public async Task<JsonResult> Details(int id)
        {
            try
            {
                var procedures = await _service.GetDetails(id);
                return FmdcResult.Success(procedures, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Details could not be fetched" + e.Message, 500);
            }
        }


        // POST api/<ReceiptsController>

        [Authorize(Roles.Administrator, Roles.Staff)]

        [HttpPost]
        public async Task<JsonResult> Post([FromBody] ReceiptViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                if (result)
                {
                    return FmdcResult.Success("Test has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Test could not be created", 400);
                }
            }
            catch (FmdcException ae)
            {

                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

        // PUT api/<ReceiptsController>
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPut("{id}")]
        public async Task<JsonResult> Put(int id)
        {
            try
            {
                var result = await _service.UpdatePaidStatus(id);
                if (result)
                {
                    return FmdcResult.Success("Test has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Test could not be updated", 400);
                }
            }

            catch (FmdcException ae)
            {

                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

        // DELETE api/<ReceiptsController>/5
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("ReceiptId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("Receipt has been deleted", null, 200);
                else
                    return FmdcResult.Error("Receipt has not been deleted", 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]")]
        public async Task<JsonResult> GetStats()
        {
            try
            {
                var id = -1;
                var doctor = GetCurrentUser();
                if (doctor is not null && doctor.Role == Roles.Doctor)
                    id = doctor.Id;
                var stats = await _service.GetStat(id);
                return FmdcResult.Success("", stats, 200);
            }
            catch (Exception e)
            {
                return FmdcResult.Error("No Stats Available" + e.Message, 500);
            }
        }

        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GenerateReceipt(int id)
        {
            var receipt = await _service.GenerateReceipt(id);
            if (receipt is not null)
            {
                var type = new ReportType("receipt.pdf", 170f, 210f, receipt);

                var path = _environment.ContentRootPath + "/Reports";
                var reportGenerator = new PdfReportGenerator();

                if (reportGenerator.Generate(path, type))
                {
                    var stream = new FileStream(path + "/receipt.pdf", FileMode.Open);
                    return new FileStreamResult(stream, "application/pdf");
                }
                else
                {
                    return FmdcResult.Error("Pdf could not been generated", 500);
                }
            }
            else
            {
                return FmdcResult.Error("Receipt could not be found", 500);
            }

        }
       
        private UserViewModel? GetCurrentUser()
        {

            var user = (UserViewModel?)HttpContext.Items["User"];
            return user;

        }
    }
}
