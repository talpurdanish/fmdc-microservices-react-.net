using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.Delete
{
    public record DeleteReceiptCommand(int Id) : IRequest<bool>;
}
