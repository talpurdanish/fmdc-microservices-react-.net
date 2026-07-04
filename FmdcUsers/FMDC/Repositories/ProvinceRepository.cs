using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using FMDC.Context;
using Microsoft.EntityFrameworkCore;

namespace FMDC.Repositories
{
    public class ProvinceRepository(FmdcUsersContext context) : Repository<Province>(context), IProvinceRepository
    {
        private readonly FmdcUsersContext _context = context;

        public async Task<PagedResults<Province>> GetProvincesAsync(DataFilter filter)
        {
            IQueryable<Province> query = _context.Provinces;

            // Apply search first
            query = ApplySearch(filter.Term, query);

            // Apply sorting
            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync();

            var provinces = filter.Pageless ? await query.ToListAsync() : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResults<Province>(provinces, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<Province> ApplySearch(string? term, IQueryable<Province> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Name!.Contains(term)
            );
        }

        private static IQueryable<Province> ApplySort(string field, int order, IQueryable<Province> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "name" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                _ => query
            };
        }
    }
}
