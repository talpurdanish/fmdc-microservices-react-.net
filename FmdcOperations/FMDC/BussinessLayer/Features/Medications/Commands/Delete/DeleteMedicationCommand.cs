using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Medications.Commands.Delete
{
    public record DeleteMedicationCommand(int Code) : IRequest<bool>;
}
