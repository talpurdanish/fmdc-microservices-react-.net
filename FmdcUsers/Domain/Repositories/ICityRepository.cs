using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;

namespace Domain.Repositories
{
    public interface ICityRepository : IRepository<City>
    {
        Task<IEnumerable<City>> GetCitiesByProvinceIdAsync(int provinceId);
        Task<City?> GetCityWithProvinceAsync(int id);
        Task<PagedResults<City>> GetCitiesWithProvinceAsync(DataFilter filter);

        Task<IEnumerable<City>> GetCitiesAsync(List<int> ids);


    }
}
