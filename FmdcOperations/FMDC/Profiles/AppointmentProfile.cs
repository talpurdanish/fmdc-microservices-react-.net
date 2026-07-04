using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;
using System.Globalization;

namespace FMDC.Profiles
{
    public class AppointmentProfile:Profile
    {

        public AppointmentProfile() { 
        
            CreateMap<Appointment, AppointmentViewModel>()
                .ForMember(dest => dest.AppointmentDate, act => act.MapFrom(src => src.Date))
                .ForMember(dest => dest.AppointmentEndDate, act => act.MapFrom(src => src.EndDate))
                .ForMember(dest => dest.StartTime, act => act.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.EndTime, act => act.MapFrom(src => src.EndTime));

            CreateMap<AppointmentViewModel, Appointment>()
                .ForMember(dest => dest.Date, act => act.MapFrom(src => src.AppointmentDate))
                .ForMember(dest => dest.EndDate, act => act.MapFrom(src => src.AppointmentEndDate))
                .ForMember(dest => dest.StartTime, act => act.MapFrom(src => src.StartTime))
                .ForMember(dest => dest.EndTime, act => act.MapFrom(src => src.EndTime));
        }

        

    }
}
