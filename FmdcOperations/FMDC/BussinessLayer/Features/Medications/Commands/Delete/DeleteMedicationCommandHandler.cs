using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Medications.Commands.Delete
{
    public class DeleteMedicationCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteMedicationCommand, bool>
    {
        public async Task<bool> Handle(DeleteMedicationCommand request, CancellationToken cancellationToken)
        {
            var medication = await context.Medications.FirstOrDefaultAsync(m=>m.Code == request.Code,cancellationToken) ?? throw new FmdcException("Medication could not be found");
            context.Medications.Remove(medication);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
