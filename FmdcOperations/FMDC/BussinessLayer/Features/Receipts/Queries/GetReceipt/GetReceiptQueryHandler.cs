using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.GetReceipt
{
    public class GetReceiptQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetReceiptQuery, Receipt?>
    {
        public async Task<Receipt?> Handle(GetReceiptQuery request, CancellationToken cancellationToken)
        {
            return await context.Receipts.FirstOrDefaultAsync(m => m.Id == request.Id,cancellationToken);
        }
    }
}
