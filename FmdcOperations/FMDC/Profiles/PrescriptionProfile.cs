using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;
using System.Globalization;

namespace FMDC.Profiles
{
    public class PrescriptionProfile : Profile
    {
        public PrescriptionProfile()
        {

            CreateMap<Prescription, PrescriptionViewModel>()

                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.Appointment!.StartTime))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Appointment!.Date.ToString("dd-MMM-yyyy", CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.Appointment!.StartTime));

            CreateMap<PrescriptionViewModel, Prescription>();

            CreateMap<AddPrescriptionViewModel, Prescription>();

        }
    }

    public class PrescriptionMedicationProfile : Profile
    {
        public PrescriptionMedicationProfile()
        {

            CreateMap<PrescriptionMedication, PrescriptionMedicationViewModel>().ForMember(dest=>dest.Medication, src=>src.MapFrom(s=>s.Medication!.Name));

            CreateMap<PrescriptionMedicationViewModel, PrescriptionMedication>();

            

        }
    }
}
