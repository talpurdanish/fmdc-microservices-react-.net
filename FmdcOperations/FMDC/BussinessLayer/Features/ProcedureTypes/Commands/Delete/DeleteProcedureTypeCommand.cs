using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Delete
{
    public record DeleteProcedureTypeCommand(int Id) : IRequest<bool>;
}
