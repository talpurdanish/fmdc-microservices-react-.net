
using Domain.Viewmodels;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Appointments.Queries.GetButtons
{
    public class AppointmentButtonsQueryHandler(FmdcOperationsContext context) : IRequestHandler<AppointmentButtonsQuery, PatientButtons>
    {
        public async Task<PatientButtons> Handle(AppointmentButtonsQuery request, CancellationToken cancellationToken)
        {
            var pb = new PatientButtons
            {
                PatientId = 0,
                Title = string.Empty,
                AId = 0,
                StartVisible = true,
                EndVisible = false,
                ReceiptVisible = false,
                PrescriptionVisible = false,
                SlipVisible = false
            };

            if (request.PatientId <= 0)
                return pb;

            var appointment = await context.Appointments
                .FirstOrDefaultAsync(a => a.PatientId == request.PatientId && a.ReceiptId == null, cancellationToken);

            if (appointment != null)
            {
                pb.AId = appointment.Id;

                if (appointment.EndDate == null)
                {
                    pb.StartVisible = false;
                    pb.EndVisible = true;
                    pb.PrescriptionVisible = true;
                   
                }
                else
                {
                    pb.SlipVisible = await context.Prescriptions.AnyAsync(p => p.AppointmentId == pb.AId, cancellationToken);
                    pb.StartVisible = false;
                    pb.ReceiptVisible = true;
                }
            }

            pb.PatientId = request.PatientId;
            return pb;
        }
    }
}
