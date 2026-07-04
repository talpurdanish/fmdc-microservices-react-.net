using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;

namespace Domain.Repositories
{
    public interface IProvinceRepository : IRepository<Province>
    {
        Task<PagedResults<Province>> GetProvincesAsync(DataFilter filter);
    }
}
