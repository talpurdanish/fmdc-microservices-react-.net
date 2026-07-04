using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;

namespace FMDC.BussinessLayer.Services
{
    public class ProvinceService : IProvinceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private IMapper _mapper;
        public ProvinceService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResults<ProvinceViewModel>> GetProvinces(DataFilter filter)
        {
            var records = await _unitOfWork.Provinces.GetProvincesAsync(filter);
            var data = _mapper.Map<IEnumerable<ProvinceViewModel>>(records.Data);
            return new PagedResults<ProvinceViewModel>(data, records.CurrentPage, records.TotalRecords, records.PageSize);
        }
        public async Task<ProvinceViewModel?> GetProvince(int id)
        {
            var province = await _unitOfWork.Provinces.GetByIdAsync(id);

            return _mapper.Map<ProvinceViewModel>(province);

        }

        public async Task<bool> Create(ProvinceViewModel viewModel)
        {

            if (viewModel.Name == "")
            {
                return false;
            }

            Province model = _mapper.Map<Province>(viewModel);
            await _unitOfWork.Provinces.AddAsync(model);
            int rowsChanged = await _unitOfWork.SaveChangesAsync();
            return rowsChanged > 0;
        }

        public async Task<bool> Update(int id, ProvinceViewModel viewModel)
        {
            bool ProvinceExists = await _unitOfWork.Provinces.AnyAsync(c => c.Id == id);

            if (!ProvinceExists || viewModel.Name == "")
            {
                return false;
            }

            Province model = _mapper.Map<Province>(viewModel);
            _unitOfWork.Provinces.Update(model);
            int rowsChanged = await _unitOfWork.SaveChangesAsync();
            return rowsChanged > 0;
        }
    }
}
