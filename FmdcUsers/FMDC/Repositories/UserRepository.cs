using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using FMDC.Context;
using Microsoft.EntityFrameworkCore;

namespace FMDC.Repositories
{
    public class UserRepository(FmdcUsersContext context) : Repository<User>(context), IUserRepository
    {
        private readonly FmdcUsersContext _context = context;

        public async Task<IEnumerable<NameIdPair>> GetDoctors()
        {
            return await _context.Users.Where(u => u.Role == Roles.Doctor)
                .Select(u => new NameIdPair { Id = u.Id, Name = u.Name })
                .ToListAsync();
        }

        public async Task<User?> GetUserByUserName(string username)
        {
            var model = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            return model;
        }
        public async Task<PagedResults<User>> GetUsersWithCityAndProvinceAsync(DataFilter filter)
        {
            IQueryable<User> query = _context.Users
                .Include(p => p.City)
                .ThenInclude(c => c.Province);

            // Apply search first
            query = ApplySearch(filter.Term, query);

            // Apply sorting
            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync();

            var users = filter.Pageless ? await query.ToListAsync() : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResults<User>(users, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<User> ApplySearch(string? term, IQueryable<User> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(u =>
                            u.Name.Contains(term) || u.PMDCNo != null && u.PMDCNo.Contains(term) ||
                            u.CNIC != null && u.CNIC.Contains(term) || u.Role.ToString().Contains(term) ||
                            u.Username.Contains(term) || u.City != null && u.City.Name.Contains(term) || u.PhoneNo != null && u.PhoneNo.Contains(term)
            );
        }

        private static IQueryable<User> ApplySort(string field, int order, IQueryable<User> query)
        {
            bool ascending = order == 1;

            return field switch
            {
                "id" => ascending ? query.OrderBy(p => p.Id) : query.OrderByDescending(p => p.Id),
                "gender" => ascending?query.OrderBy(p=>p.Gender): query.OrderByDescending(p=>p.Gender),
                "name" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                "pmdcno" => ascending ? query.OrderBy(p => p.PMDCNo) : query.OrderByDescending(p => p.PMDCNo),
                "cnic" => ascending ? query.OrderBy(p => p.CNIC) : query.OrderByDescending(p => p.CNIC),
                "role" => ascending ? query.OrderBy(p => p.Role) : query.OrderByDescending(p => p.Role),
                "username" => ascending ? query.OrderBy(p => p.Username) : query.OrderByDescending(p => p.Username),
                "city" => ascending ? query.OrderBy(p => p.City.Name) : query.OrderByDescending(p => p.City.Name),
                "province" => ascending ? query.OrderBy(p => p.City.Province.Name) : query.OrderByDescending(p => p.City.Province.Name),
                _ => query
            };
        }

        public async Task<User?> GetUserWithCityAndProvinceAsync(int id)
        {
            return await _context.Users.Include(u => u.City).ThenInclude(c => c.Province).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>?> GetUsersAsync(List<int> ids)
        {
            return await _context.Users.Where(u=>ids.Contains(u.Id)).ToListAsync();
        }
    }
}
