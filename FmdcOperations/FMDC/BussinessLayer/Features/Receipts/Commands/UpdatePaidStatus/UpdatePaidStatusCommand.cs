using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.Update
{
    public record UpdatePaidStatusCommand(int Id) : IRequest<bool>;
}
