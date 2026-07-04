using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Create
{
    public record CreateProcedureTypeCommand(ProcedureType Model) : IRequest<bool>;
}
