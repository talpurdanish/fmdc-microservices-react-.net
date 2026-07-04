using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Medications.Queries.GetOne
{
    public record GetMedicationQuery(int Code) : IRequest<Medication?>;
}
