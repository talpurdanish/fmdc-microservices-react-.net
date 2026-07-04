using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Commands.Update
{
    public record UpdateMedicationTypeCommand(MedicationType Model) : IRequest<bool>;
}
