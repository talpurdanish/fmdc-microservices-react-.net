using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Queries.GetOne
{
    public record GetMedicationTypeQuery(int Id) : IRequest<MedicationType?>;
}
