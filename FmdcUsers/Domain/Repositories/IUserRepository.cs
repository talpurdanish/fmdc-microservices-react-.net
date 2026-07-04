using Domain.Helpers;
using Domain.Models;

namespace Domain.Repositories
{
    public interface IUserRepository : IRepository<User>
    {

        Task<User?> GetUserByUserName(string username);
        Task<PagedResults<User>> GetUsersWithCityAndProvinceAsync(DataFilter filter);
        Task<User?> GetUserWithCityAndProvinceAsync(int id);

        Task<IEnumerable<User>?> GetUsersAsync(List<int> ids);

        Task<IEnumerable<NameIdPair>> GetDoctors();
    }
}
