using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.Details
{
    public record ListReceiptDetailsQuery(int ReceiptId) : IRequest<List<int>>;
}
