using MediatR;

namespace FMDC.BussinessLayer.Features.Tests.Commands.Delete
{
    public record DeleteTestCommand(int Id) : IRequest<bool>;
}
