using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.TestParameters.Queries.List
{
    public class ListTestParameterQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListTestParameterQuery, PagedResults<TestParameter>>
    {
        public async Task<PagedResults<TestParameter>> Handle(ListTestParameterQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            var query = context.TestParameters.Include(m => m.Test).Where(m => (filter.Id <0 || m.TestId == filter.Id));

            query = ApplySearch(filter.Term, query);

            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var TestParameters = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<TestParameter>(TestParameters, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<TestParameter> ApplySearch(string? term, IQueryable<TestParameter> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Name.Contains(term)  || q.Test != null && q.Test.Name.Contains(term)
            );
        }

        private static IQueryable<TestParameter> ApplySort(string field, int order, IQueryable<TestParameter> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "code" => ascending ? query.OrderBy(p => p.Id) : query.OrderByDescending(p => p.Id),
                "name" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                "type" => ascending ? query.OrderBy(p => p.TestId) : query.OrderByDescending(p => p.TestId),
                _ => query.OrderBy(p => p.Id)
            };
        }
    }
}
