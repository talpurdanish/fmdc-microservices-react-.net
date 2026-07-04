using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.Create
{
    public class CreateReceiptCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateReceiptCommand, bool>
    {
        public async Task<bool> Handle(CreateReceiptCommand request, CancellationToken cancellationToken)
        {
            using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                await context.Receipts.AddAsync(request.Model, cancellationToken);
                var rowsChanged = await context.SaveChangesAsync(cancellationToken);
                if (rowsChanged > 0)
                {

                    var rpList = new List<ReceiptDetails>();
                    foreach (var p in request.ProcedureIds)
                    {
                        var rp = new ReceiptDetails()
                        {
                            ProcedureId = p,
                            ReceiptId = request.Model.Id
                        };
                        rpList.Add(rp);
                    }

                    foreach (var t in request.TestIds)
                    {
                        var rp = new ReceiptDetails()
                        {
                            TestId = t,
                            ReceiptId = request.Model.Id
                        };
                        rpList.Add(rp);
                    }

                    await context.ReceiptDetails.AddRangeAsync(rpList, cancellationToken);

                    var appointment = await context.Appointments.FirstOrDefaultAsync(a => a.Id == request.Model.AppointmentId, cancellationToken);
                    if (appointment != null)
                    {
                        appointment.ReceiptId = request.Model.Id;
                        context.Update(appointment);
                    }

                    await context.SaveChangesAsync(cancellationToken);

                }
                await transaction.CommitAsync(cancellationToken);
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                transaction.Rollback(); 
                return false;
            }
        }
    }
}
