using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Services
{
    public class CityService : ICityService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public CityService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResults<CityViewModel>> GetCities(DataFilter filter)
        {
            var records = await _unitOfWork.Cities.GetCitiesWithProvinceAsync(filter);
            var data = _mapper.Map<IEnumerable<CityViewModel>>(records.Data);
            return new PagedResults<CityViewModel>(data, records.CurrentPage, records.TotalRecords, records.PageSize);
        }

        public async Task<CityViewModel?> GetCity(int id)
        {
            if (id <= 0)
            {
                throw new FmdcException("Id is not valid");
            }
            var city = await _unitOfWork.Cities.GetCityWithProvinceAsync(id);
            if (city is null)
            {
                throw new FmdcException("City could not be found");
            }

            var viewModel = _mapper.Map<CityViewModel>(city);
            if (viewModel is null)
            {
                throw new FmdcException("City could not be found");
            }

            return viewModel;
        }
        public async Task<bool> Create(CityViewModel viewModel)
        {

            if (viewModel.ProvinceId <= 0 || viewModel.Name == "")
            {
                return false;
            }

            City model = _mapper.Map<City>(viewModel);

            Province? province = await _unitOfWork.Provinces.Find(p => p.Id == viewModel.ProvinceId).FirstOrDefaultAsync();
            model.Province = province!;
            await _unitOfWork.Cities.AddAsync(model);
            int rowsChanged = await _unitOfWork.SaveChangesAsync();
            return rowsChanged > 0;
        }

        public async Task<bool> Update(int id, CityViewModel viewModel)
        {
            if (id <= 0)
            {
                return false;
            }

            City? city = await _unitOfWork.Cities.GetByIdAsync(id);
            Province? province = await _unitOfWork.Provinces.Find(p => p.Id == viewModel.ProvinceId).FirstOrDefaultAsync();

            if (city == null || province == null || viewModel.ProvinceId <= 0 || viewModel.Name == "")
            {
                return false;
            }

            city.Name = viewModel.Name;
            city.Province = province;
            _unitOfWork.Cities.Update(city);
            int rowsChanged = await _unitOfWork.SaveChangesAsync();
            return rowsChanged > 0;
        }

        public async Task<bool> Delete(int id)
        {
            if (id <= 0)
            {
                return false;
            }
            City? city = await _unitOfWork.Cities.GetByIdAsync(id);

            if (city == null)
            {
                return false;
            }

            

            _unitOfWork.Cities.Remove(city);
            int rowsChanged = await _unitOfWork.SaveChangesAsync();
            return rowsChanged > 0;
        }


    }
}
