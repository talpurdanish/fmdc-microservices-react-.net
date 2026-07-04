using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.ReceiptProcedures
{
    public class ListReceiptProceduresQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListReceiptProceduresQuery, List<ReceiptProcedure>>
    {
        public async Task<List<ReceiptProcedure>> Handle(ListReceiptProceduresQuery request, CancellationToken cancellationToken)
        {
            return await context.ReceiptDetails.
                Include(r => r.Procedure).
                Where(rd => request.ReceiptIds.Contains(rd.ReceiptId) && rd.ProcedureId != null ).
                Select(rd =>
                    new ReceiptProcedure
                    {
                        ReceiptId = rd.ReceiptId,
                        Procedure = rd.Procedure
                    }).ToListAsync(cancellationToken);
        }

    }
}
