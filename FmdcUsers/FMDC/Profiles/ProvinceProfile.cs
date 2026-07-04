using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.Profiles
{
    public class ProvinceProfile : Profile
    {

        public ProvinceProfile()
        {
            CreateMap<Province, ProvinceViewModel>();
            CreateMap<ProvinceViewModel, Province>();

        }
    }
}
