using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.Delete
{
    public class DeleteReceiptCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteReceiptCommand, bool>
    {
        public async Task<bool> Handle(DeleteReceiptCommand request, CancellationToken cancellationToken)
        {
            using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            try
            {

                var receipt = await context.Receipts.FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken) ?? throw new FmdcException("Receipt could not be found");
                var receiptDetails = await context.ReceiptDetails.Where(rd => rd.ReceiptId == request.Id).ToListAsync(cancellationToken);
                context.ReceiptDetails.RemoveRange(receiptDetails);
                context.Receipts.Remove(receipt);
                var rowsChanged = await context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);                    
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync(cancellationToken);
                return false;
            }
        }
    }
}
