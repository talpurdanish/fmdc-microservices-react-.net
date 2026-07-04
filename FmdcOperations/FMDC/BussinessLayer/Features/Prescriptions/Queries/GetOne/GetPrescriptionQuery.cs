using Domain.Models;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.Enums;
using MediatR;

namespace FMDC.BussinessLayer.Features.Prescriptions.Queries.GetOne
{
    public record GetPrescriptionQuery(int Id, PrescriptionIdType Type = PrescriptionIdType.ByPrescriptionId) : IRequest<Prescription?>;
}
