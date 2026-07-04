using Domain.Helpers;
using Domain.Models;
using FMDC.BussinessLayer.Features.Receipts.Queries.Enums;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.ReceiptAppointments
{
    public class GetReceiptAppointmentQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetReceiptAppointmentQuery, Appointment?>
    {
        public async Task<Appointment?> Handle(GetReceiptAppointmentQuery request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.Type == ReceiptAppointmentType.ByPatientId)
                {
                    return await context.Appointments.FirstOrDefaultAsync(a => a.PatientId == request.Id && a.ReceiptId == null, cancellationToken);
                }

                else
                {
                    return await context.Appointments.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);
                }
            }
            catch (Exception e)
            {

                throw new FmdcException(e.Message);
            }

        }
    }
}
