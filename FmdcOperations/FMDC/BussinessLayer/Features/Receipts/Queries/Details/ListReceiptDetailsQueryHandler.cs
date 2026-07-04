using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.Details
{
    public class ListReceiptDetailssQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListReceiptDetailsQuery, List<int>>
    {
        public async Task<List<int>> Handle(ListReceiptDetailsQuery request, CancellationToken cancellationToken)
        {
            return await context.ReceiptDetails.Where(rd => rd.ReceiptId == request.ReceiptId).Select(q=>q.Id)
                .ToListAsync(cancellationToken);
        }

    }
}
