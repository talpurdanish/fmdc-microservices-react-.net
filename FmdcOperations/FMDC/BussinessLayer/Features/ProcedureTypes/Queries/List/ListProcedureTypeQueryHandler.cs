using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Queries.List
{
    public class ListProcedureTypeQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListProcedureTypeQuery, PagedResults<ProcedureType>>
    {
        public async Task<PagedResults<ProcedureType>> Handle(ListProcedureTypeQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            IQueryable<ProcedureType> query = context.ProcedureTypes;

            query = ApplySearch(filter.Term, query);

            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var ProcedureTypes = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<ProcedureType>(ProcedureTypes, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<ProcedureType> ApplySearch(string? term, IQueryable<ProcedureType> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Name.Contains(term)
            );
        }

        private static IQueryable<ProcedureType> ApplySort(string field, int order, IQueryable<ProcedureType> query)
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
