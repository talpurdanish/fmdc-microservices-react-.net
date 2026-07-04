using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.List
{
    public class ListReceiptTestsQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListReceiptTestsQuery, List<ReceiptTest>>
    {
        public async Task<List<ReceiptTest>> Handle(ListReceiptTestsQuery request, CancellationToken cancellationToken)
        {
            return await context.ReceiptDetails.
                Include(r => r.Test).
                Where(rd => request.ReceiptIds.Contains(rd.ReceiptId) && rd.TestId != null).
                Select(rd =>
                    new ReceiptTest
                    {
                        ReceiptId = rd.ReceiptId,
                        Test = rd.Test
                    }).ToListAsync(cancellationToken);
        }

    }
}
