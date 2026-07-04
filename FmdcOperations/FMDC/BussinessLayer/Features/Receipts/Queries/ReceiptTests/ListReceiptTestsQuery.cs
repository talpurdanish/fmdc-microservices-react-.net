using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.List
{
    public record ListReceiptTestsQuery(List<int> ReceiptIds) : IRequest<List<ReceiptTest>>;
}
