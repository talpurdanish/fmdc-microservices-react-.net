using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.Profiles
{
    public class ReceiptProfile : Profile
    {

        public ReceiptProfile()
        {
            CreateMap<ReceiptViewModel, Receipt>()
                .ForMember(dest => dest.Date, act => act.MapFrom(src =>
                DateTime.Parse(src.Date, System.Globalization.CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.UserId, act => act.MapFrom(src => src.DoctorId))
                .ForMember(dest => dest.Discount, act => act.MapFrom(src => src.Discount))
                .ForMember(dest => dest.Time, act => act.MapFrom(src => src.Time));
            CreateMap<Receipt, ReceiptViewModel>()
                .ForMember(dest=> dest.Date, src=>src.MapFrom(s=>s.Date.ToString("dd MMM, yyyy", System.Globalization.CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.Time, src => src.MapFrom(s => s.Time))
                .ForMember(dest => dest.Discount, src => src.MapFrom(s => s.Discount))
                .ForMember(dest => dest.Id, src => src.MapFrom(s => s.Id))
                .ForMember(dest => dest.Appointment, src => src.MapFrom(s => s.Appointment!.Date.ToString("dd MMM, yyyy", System.Globalization.CultureInfo.InvariantCulture) + " " + s.Appointment.StartTime));
        }
    }
}
