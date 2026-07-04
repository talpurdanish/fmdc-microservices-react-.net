using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.TestParameters.Commands.Update
{
    public record UpdateTestParameterCommand(TestParameter Model) : IRequest<bool>;
}
