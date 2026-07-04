using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using FMDC.Context;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace FMDC.Repositories
{
    public class PatientRepository(FmdcUsersContext context) : Repository<Patient>(context), IPatientRepository
    {
        private readonly FmdcUsersContext _context = context;

        public async Task<PagedResults<Patient>> GetPatientsWithCityAndProvinceAsync(DataFilter filter)
        {
            IQueryable<Patient> query = _context.Patients
                .Include(p => p.City)
                .ThenInclude(c => c.Province);

            // Apply search first
            query = ApplySearch(filter.Term, query);

            // Apply sorting
            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync();

            var patients = filter.Pageless ? await query.ToListAsync() : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResults<Patient>(patients, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<Patient> ApplySearch(string? term, IQueryable<Patient> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(p =>
                p.Name.Contains(term) ||
                p.MRNoID.ToString(CultureInfo.InvariantCulture).Contains(term) ||
                (p.PhoneNo != null && p.PhoneNo.Contains(term))
            );
        }

        private static IQueryable<Patient> ApplySort(string field, int order, IQueryable<Patient> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "id" => ascending ? query.OrderBy(p => p.Id) : query.OrderByDescending(p => p.Id),
                "name" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
                "bloodgroup" => ascending ? query.OrderBy(p => p.BloodGroup) : query.OrderByDescending(p => p.BloodGroup),
                "cnic" => ascending ? query.OrderBy(p => p.CNIC) : query.OrderByDescending(p => p.CNIC),
                "patientnumber" => ascending ? query.OrderBy(p => p.PatientNumber) : query.OrderByDescending(p => p.PatientNumber),
                "dateofbirth" => ascending ? query.OrderBy(p => p.DateofBirth) : query.OrderByDescending(p => p.DateofBirth),
                _ => query
            };
        }

        public async Task<Patient?> GetPatientWithCityAndProvinceAsync(int id)
        {
            return await _context.Patients.Include(p => p.City).ThenInclude(c => c.Province).FirstOrDefaultAsync(p => p.Id == id);

        }

        public async Task<object?> GetStatisticsAsync()
        {
            var result = await _context.Patients.GroupBy(p => 1).Select(g => new
            {
                Total = g.Count(),
                males = g.Where(p => p.Gender == Genders.Male).Count(),
                females = g.Where(p => p.Gender == Genders.Female).Count(),
                others = g.Where(p => p.Gender == Genders.Other).Count(),
            }).FirstOrDefaultAsync();
            return result;
        }

        public async Task<int?> GetMaxMRId()
        {
            return await _context.Patients.MaxAsync(p => p.MRNoID);
        }

        public async Task<IEnumerable<Patient>> GetPatientsAsync(List<int> ids)
        {
            return await _context.Patients.Where(p => ids.Contains(p.Id)).ToListAsync();
        }
    }
}
