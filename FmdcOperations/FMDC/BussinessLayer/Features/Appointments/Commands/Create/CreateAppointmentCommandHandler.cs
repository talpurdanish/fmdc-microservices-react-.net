using Domain.Models;
using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Commands.Create
{
    public class CreateAppointmentCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateAppointmentCommand, bool>
    {
        public async Task<bool> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
        {
            var PatientId = request.Model.PatientId;
            var UserId = request.Model.UserId;
            var currentDate = DateTime.Now;

            Appointment model = new()
            {
                PatientId = PatientId,
                UserId = UserId,
                Date = currentDate,
                StartTime = TimeOnly.FromDateTime(currentDate),
            };

            await context.Appointments.AddAsync(model, cancellationToken);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);

            return rowsChanged > 0;
        }
    }
}
