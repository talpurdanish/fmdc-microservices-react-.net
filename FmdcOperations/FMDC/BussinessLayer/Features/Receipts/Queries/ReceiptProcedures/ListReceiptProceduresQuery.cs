using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.ReceiptProcedures
{
    public record ListReceiptProceduresQuery(List<int> ReceiptIds) : IRequest<List<ReceiptProcedure>>;
}
