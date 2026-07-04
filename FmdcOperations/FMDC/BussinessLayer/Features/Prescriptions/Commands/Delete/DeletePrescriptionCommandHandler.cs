using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Prescriptions.Commands.Delete
{
    public class DeletePrescriptionCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeletePrescriptionCommand, bool>
    {
        public async Task<bool> Handle(DeletePrescriptionCommand request, CancellationToken cancellationToken)
        {
            var Prescription = await context.Prescriptions.FirstOrDefaultAsync(m=>m.Id == request.Id,cancellationToken) ?? throw new FmdcException("Prescription could not be found");
            context.Prescriptions.Remove(Prescription);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
