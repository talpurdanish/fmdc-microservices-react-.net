using Domain.Helpers;
using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Medications.Queries.List
{
    public record ListMedicationQuery(DataFilter Filter) : IRequest<PagedResults<Medication>>;
}
