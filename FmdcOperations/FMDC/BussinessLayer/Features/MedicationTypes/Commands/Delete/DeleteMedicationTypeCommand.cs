using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Commands.Delete
{
    public record DeleteMedicationTypeCommand(int Id) : IRequest<bool>;
}
