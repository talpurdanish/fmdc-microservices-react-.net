using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Update
{
    public record UpdateProcedureTypeCommand(ProcedureType Model) : IRequest<bool>;
}
