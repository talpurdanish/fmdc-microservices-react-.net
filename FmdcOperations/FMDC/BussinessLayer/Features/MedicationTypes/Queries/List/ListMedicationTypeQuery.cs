using Domain.Helpers;
using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Queries.List
{
    public record ListMedicationTypeQuery(DataFilter Filter) : IRequest<PagedResults<MedicationType>>;
}
