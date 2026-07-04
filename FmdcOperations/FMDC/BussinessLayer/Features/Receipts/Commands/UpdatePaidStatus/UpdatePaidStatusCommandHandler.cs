using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.Update
{
    public class UpdatePaidStatusCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdatePaidStatusCommand, bool>
    {
        public async Task<bool> Handle(UpdatePaidStatusCommand request, CancellationToken cancellationToken)
        {
            var receipt = await context.Receipts.FirstOrDefaultAsync(r=>r.Id == request.Id, cancellationToken) ?? throw new FmdcException("Receipt could not be found");
            receipt.Paid = true;
            context.Receipts.Update(receipt);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);

            return rowsChanged > 0;
        }
    }
}
