using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Procedures.Commands.Update
{
    public record UpdateProcedureCommand(Procedure Model) : IRequest<bool>;
}
