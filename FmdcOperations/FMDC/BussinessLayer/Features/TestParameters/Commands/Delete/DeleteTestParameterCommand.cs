using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.TestParameters.Commands.Delete
{
    public record DeleteTestParameterCommand(int Id) : IRequest<bool>;
}
