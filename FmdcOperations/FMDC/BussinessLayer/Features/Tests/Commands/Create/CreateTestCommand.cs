using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Tests.Commands.Create
{
    public record CreateTestCommand(Test Model) : IRequest<bool>;
}
