using Domain.Helpers;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface ICityService
    {
        Task<PagedResults<CityViewModel>> GetCities(DataFilter filter);

        Task<CityViewModel?> GetCity(int id);

        Task<bool> Create(CityViewModel viewModel);
        Task<bool> Update(int id, CityViewModel viewModel);

        Task<bool> Delete(int id);

    }
}
