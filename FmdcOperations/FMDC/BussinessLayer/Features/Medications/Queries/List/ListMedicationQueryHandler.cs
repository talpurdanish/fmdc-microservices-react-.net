using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Medications.Queries.List
{
    public class ListMedicationQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListMedicationQuery, PagedResults<Medication>>
    {
        public async Task<PagedResults<Medication>> Handle(ListMedicationQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            var query = context.Medications.Include(m => m.MedicationType).Where(m => (filter.Id <0 || m.MedicationTypeId == filter.Id));

            query = ApplySearch(filter.Term, query);

            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var medications = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<Medication>(medications, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<Medication> ApplySearch(string? term, IQueryable<Medication> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Name.Contains(term) || q.Brand.Contains(term) || q.MedicationType != null && q.MedicationType.Name.Contains(term)
            );
        }

        private static IQueryable<Medication> ApplySort(string field, int order, IQueryable<Medication> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "code" => ascending ? query.OrderBy(p => p.Code) : query.OrderByDescending(p => p.Code),
                "name" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                "brand" => ascending ? query.OrderBy(p => p.Brand) : query.OrderByDescending(p => p.Brand),
                "type" => ascending ? query.OrderBy(p => p.MedicationTypeId) : query.OrderByDescending(p => p.MedicationTypeId),
                _ => query.OrderBy(p => p.Code)
            };
        }
    }
}
