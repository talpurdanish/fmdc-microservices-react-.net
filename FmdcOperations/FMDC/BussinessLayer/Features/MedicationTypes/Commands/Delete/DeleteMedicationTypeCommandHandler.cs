using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Commands.Delete
{
    public class DeleteMedicationTypeCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteMedicationTypeCommand, bool>
    {
        public async Task<bool> Handle(DeleteMedicationTypeCommand request, CancellationToken cancellationToken)
        {
            var MedicationType = await context.MedicationTypes.FirstOrDefaultAsync(m=>m.Id == request.Id,cancellationToken) ?? throw new FmdcException("MedicationType could not be found");
            context.MedicationTypes.Remove(MedicationType);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
