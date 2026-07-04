using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Prescriptions.Commands.Delete
{
    public record DeletePrescriptionCommand(int Id) : IRequest<bool>;
}
