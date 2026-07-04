using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using FMDC.Context;
using Microsoft.EntityFrameworkCore;

namespace FMDC.Repositories
{
    public class CityRepository(FmdcUsersContext context) : Repository<City>(context), ICityRepository
    {
        private readonly FmdcUsersContext _context = context;

        public async Task<IEnumerable<City>> GetCitiesByProvinceIdAsync(int provinceId)
        {
            return await _context.Cities.Where(c => c.ProvinceId == provinceId).ToListAsync();
        }

        public async Task<IEnumerable<City>> GetCitiesAsync(List<int> ids)
        {
            return await _context.Cities.Where(c => ids.Contains(c.Id)).ToListAsync();
        }

        public async Task<City?> GetCityWithProvinceAsync(int id)
        {
            return await _context.Cities.Include(c => c.Province).FirstOrDefaultAsync(c => c.Id == id);
        }


        public async Task<PagedResults<City>> GetCitiesWithProvinceAsync(DataFilter filter)
        {
            IQueryable<City> query = _context.Cities.Include(c => c.Province);

            if (filter.Id > 0) {
                query = query.Where(c => c.ProvinceId == filter.Id);
            }
            // Apply search first
            query = ApplySearch(filter.Term, query);

            // Apply sorting
            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync();

            var cities = filter.Pageless ? await query.ToListAsync() : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResults<City>(cities, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<City> ApplySearch(string? term, IQueryable<City> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Name!.Contains(term) || q.Province!.Name!.Contains(term)
            );
        }

        private static IQueryable<City> ApplySort(string field, int order, IQueryable<City> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "name" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                "province" => ascending ? query.OrderBy(p => p.Province.Name) : query.OrderByDescending(p => p.Province.Name),
                _ => query
            };
        }
    }
}
