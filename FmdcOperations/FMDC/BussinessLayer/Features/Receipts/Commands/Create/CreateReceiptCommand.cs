using Domain.Models;
using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.Create
{
    public record CreateReceiptCommand(Receipt Model, List<int> ProcedureIds, List<int> TestIds) : IRequest<bool>;
}
