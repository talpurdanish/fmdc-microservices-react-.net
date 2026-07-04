using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Queries.List
{
    public class ListMedicationTypeQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListMedicationTypeQuery, PagedResults<MedicationType>>
    {
        public async Task<PagedResults<MedicationType>> Handle(ListMedicationTypeQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            IQueryable<MedicationType> query = context.MedicationTypes;

            query = ApplySearch(filter.Term, query);

            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var MedicationTypes = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<MedicationType>(MedicationTypes, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<MedicationType> ApplySearch(string? term, IQueryable<MedicationType> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Name.Contains(term)
            );
        }

        private static IQueryable<MedicationType> ApplySort(string field, int order, IQueryable<MedicationType> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "id" => ascending ? query.OrderBy(p => p.Id) : query.OrderByDescending(p => p.Id),
                "name" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                
                _ => query.OrderBy(p => p.Id)
            };
        }
    }
}
