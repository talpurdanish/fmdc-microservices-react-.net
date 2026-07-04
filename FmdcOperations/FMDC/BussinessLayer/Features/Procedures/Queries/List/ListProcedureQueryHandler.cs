using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Procedures.Queries.List
{
    public class ListProcedureQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListProcedureQuery, PagedResults<Procedure>>
    {
        public async Task<PagedResults<Procedure>> Handle(ListProcedureQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            var query = context.Procedures.Include(m => m.ProcedureType).Where(m => (filter.Id <0 || m.ProcedureTypeId == filter.Id));

            query = ApplySearch(filter.Term, query);

            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var Procedures = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<Procedure>(Procedures, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<Procedure> ApplySearch(string? term, IQueryable<Procedure> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Name.Contains(term)  || q.ProcedureType != null && q.ProcedureType.Name.Contains(term)
            );
        }

        private static IQueryable<Procedure> ApplySort(string field, int order, IQueryable<Procedure> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "code" => ascending ? query.OrderBy(p => p.Id) : query.OrderByDescending(p => p.Id),
                "name" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                "type" => ascending ? query.OrderBy(p => p.ProcedureTypeId) : query.OrderByDescending(p => p.ProcedureTypeId),
                _ => query.OrderBy(p => p.Id)
            };
        }
    }
}
