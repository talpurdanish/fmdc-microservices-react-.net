using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.UpdateAppointment
{
    public class UpdateAppointmentCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateAppointmentCommand, bool>
    {
        public async Task<bool> Handle(UpdateAppointmentCommand request, CancellationToken cancellationToken)
        {
            context.Appointments.Update(request.Model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
