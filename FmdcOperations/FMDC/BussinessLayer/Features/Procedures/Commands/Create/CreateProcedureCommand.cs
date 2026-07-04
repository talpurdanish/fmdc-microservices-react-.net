using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Procedures.Commands.Create
{
    public record CreateProcedureCommand(Procedure Model) : IRequest<bool>;
}
