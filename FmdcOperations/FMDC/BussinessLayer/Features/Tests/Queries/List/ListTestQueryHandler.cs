using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Tests.Queries.List
{
    public class ListTestQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListTestQuery, PagedResults<Test>>
    {
        public async Task<PagedResults<Test>> Handle(ListTestQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            IQueryable<Test> query = context.Tests;

            query = ApplySearch(filter.Term, query);

            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var Tests = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<Test>(Tests, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<Test> ApplySearch(string? term, IQueryable<Test> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Name.Contains(term)
            );
        }

        private static IQueryable<Test> ApplySort(string field, int order, IQueryable<Test> query)
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
