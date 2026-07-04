using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Prescriptions.Commands.Create
{
    public record CreatePrescriptionCommand(Prescription Model, List<string> Medications, List<int> Tests) : IRequest<bool>;
}
