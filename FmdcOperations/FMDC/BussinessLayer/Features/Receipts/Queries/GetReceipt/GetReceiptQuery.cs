using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.GetReceipt
{
    public record GetReceiptQuery(int Id) : IRequest<Receipt?>;
}
