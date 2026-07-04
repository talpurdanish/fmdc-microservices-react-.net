using Domain.Helpers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Domain.Repositories
{
    public interface IPatientRepository : IRepository<Patient>
    {
        Task<PagedResults<Patient>> GetPatientsWithCityAndProvinceAsync(DataFilter filter);
        Task<Patient?> GetPatientWithCityAndProvinceAsync(int id);
        Task<object?> GetStatisticsAsync();

        Task<int?> GetMaxMRId();

        Task<IEnumerable<Patient>> GetPatientsAsync(List<int> ids);

    }

}
