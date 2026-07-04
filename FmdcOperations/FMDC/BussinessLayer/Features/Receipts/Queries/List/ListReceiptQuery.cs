using Domain.Helpers;
using Domain.Models;
using FMDC.BussinessLayer.Features.Receipts.Queries.Enums;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.List
{
    public record ListReceiptQuery(DataFilter Filter, ReceiptListType Type= ReceiptListType.All) : IRequest<PagedResults<Receipt>>;
}
