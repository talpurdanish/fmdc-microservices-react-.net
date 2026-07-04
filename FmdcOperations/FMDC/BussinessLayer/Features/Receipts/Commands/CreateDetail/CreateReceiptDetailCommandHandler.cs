using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.Create
{
    public class CreateReceiptDetailCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateReceiptDetailsCommand, bool>
    {
        public async Task<bool> Handle(CreateReceiptDetailsCommand request, CancellationToken cancellationToken)
        {
            await context.ReceiptDetails.AddRangeAsync(request.ReceiptDetailsList, cancellationToken);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
       
    }
}
