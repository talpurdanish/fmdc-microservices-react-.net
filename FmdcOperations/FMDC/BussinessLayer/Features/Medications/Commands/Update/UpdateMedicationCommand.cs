using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Medications.Commands.Update
{
    public record UpdateMedicationCommand(Medication Model) : IRequest<bool>;
}
