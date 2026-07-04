using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.Profiles
{
    public class CityProfile : Profile
    {

        public CityProfile()
        {
            // Map City -> CityViewModel
            CreateMap<City, CityViewModel>()
                .ForMember(dest => dest.ProvinceName,
                           opt => opt.MapFrom(src => src.Province != null ? src.Province.Name:""));

            // Map CityViewModel -> City
            CreateMap<CityViewModel, City>()
                .ForMember(dest => dest.ProvinceId,
                           opt => opt.MapFrom(src => src.ProvinceId))
                .ForMember(dest => dest.Id,
                           opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name,
                           opt => opt.MapFrom(src => src.Name))
                // Ignore Province navigation property when mapping back
                .ForMember(dest => dest.Province, opt => opt.Ignore());


        }
    }
}
