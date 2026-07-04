using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Medications.Commands.Update
{
    public class UpdateMedicationCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateMedicationCommand, bool>
    {
        public async Task<bool> Handle(UpdateMedicationCommand request, CancellationToken cancellationToken)
        {
            context.Medications.Update(request.Model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
