using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Procedures.Commands.Delete
{
    public record DeleteProcedureCommand(int Id) : IRequest<bool>;
}
