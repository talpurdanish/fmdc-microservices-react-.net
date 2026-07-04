using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Commands.Create
{
    public record CreateMedicationTypeCommand(MedicationType Model) : IRequest<bool>;
}
