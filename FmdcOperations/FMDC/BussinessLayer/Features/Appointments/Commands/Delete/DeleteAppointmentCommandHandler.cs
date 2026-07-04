using Domain.Models;
using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Commands.Delete
{
    public class DeleteAppointmentCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteAppointmentCommand, bool>
    {
        public async Task<bool> Handle(DeleteAppointmentCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var appointment = await context.Appointments.FindAsync([request.Id], cancellationToken);
                if (appointment == null)
                {
                    return false;
                }

                context.Appointments.Remove(appointment);

                var rowsChanged = await context.SaveChangesAsync(cancellationToken);

                return rowsChanged > 0;
            }
            catch (Exception)
            {

                return false;
            }
        }
    }
}
