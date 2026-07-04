using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Tests.Commands.Update
{
    public record UpdateTestCommand(Test Model) : IRequest<bool>;
}
