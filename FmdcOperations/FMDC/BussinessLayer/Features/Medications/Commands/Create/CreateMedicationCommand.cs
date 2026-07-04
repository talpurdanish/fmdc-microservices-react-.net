using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Medications.Commands.Create
{
    public record CreateMedicationCommand(Medication Model) : IRequest<bool>;
}
