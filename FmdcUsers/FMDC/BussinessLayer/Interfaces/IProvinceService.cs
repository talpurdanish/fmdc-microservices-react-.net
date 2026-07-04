using Domain.Helpers;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IProvinceService
    {

        Task<PagedResults<ProvinceViewModel>> GetProvinces(DataFilter filter);
        Task<ProvinceViewModel?> GetProvince(int id);

        Task<bool> Create(ProvinceViewModel viewModel);
        Task<bool> Update(int id, ProvinceViewModel viewModel);
    }
}
