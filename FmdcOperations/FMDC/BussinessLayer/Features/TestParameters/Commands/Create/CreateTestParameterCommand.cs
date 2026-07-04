using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.TestParameters.Commands.Create
{
    public record CreateTestParameterCommand(TestParameter Model) : IRequest<bool>;
}
