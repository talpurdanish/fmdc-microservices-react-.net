using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.Create
{
    public record CreateReceiptDetailsCommand(List<ReceiptDetails> ReceiptDetailsList) : IRequest<bool>;
}
