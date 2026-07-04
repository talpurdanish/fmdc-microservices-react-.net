using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.Profiles
{
    public class MedicationProfile : Profile
    {

        public MedicationProfile()
        {
            CreateMap<Medication, MedicationViewModel>()
                .ForMember(dest => dest.TypeID, opt => opt.MapFrom(src => src.MedicationTypeId));

            CreateMap<MedicationViewModel, Medication>()
                .ForMember(dest => dest.MedicationTypeId, opt => opt.MapFrom(src => src.TypeID));
        }
    }

    public class MedicationTypeProfile : Profile
    {

        public MedicationTypeProfile()
        {
            CreateMap<MedicationType, MedicationTypeViewModel>();

            CreateMap<MedicationTypeViewModel, MedicationType>();
        }
    }
}
