using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.Profiles
{
    public class ReportProfile : Profile
    {

        public ReportProfile()
        {
            CreateMap<LabReport, LabReportViewModel>()
                .ForMember(dest => dest.ReportDate, opt => opt.MapFrom(src => src.ReportDate.ToString("dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.ReportTime, opt => opt.MapFrom(src => $@"{src.ReportTime:hh\:mm}"))
                .ForMember(dest => dest.ReportDeliveryDate, opt => opt.MapFrom(src => src.ReportDeliveryDate.ToString("dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.ReportDeliveryTime, opt => opt.MapFrom(src => $@"{src.ReportDeliveryTime:hh\:mm}"))
                .ForMember(dest => dest.ReportNoString, opt => opt.MapFrom(src => src.ReportNumber.ToString("D8", System.Globalization.CultureInfo.InvariantCulture)));


            CreateMap<LabReportViewModel, LabReport>()
                .ForMember(dest => dest.ReportDate, opt => opt.MapFrom(src => DateTime.ParseExact(src.ReportDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.ReportTime, opt => opt.MapFrom(src => TimeSpan.ParseExact(src.ReportTime, "hh\\:mm", System.Globalization.CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.ReportDeliveryDate, opt => opt.MapFrom(src => DateTime.ParseExact(src.ReportDeliveryDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.ReportDeliveryTime, opt => opt.MapFrom(src => TimeSpan.ParseExact(src.ReportDeliveryTime, "hh\\:mm", System.Globalization.CultureInfo.InvariantCulture)))
                .ForMember(dest => dest.ReportNumber, opt => opt.MapFrom(src => int.Parse(src.ReportNoString, System.Globalization.CultureInfo.InvariantCulture)));
        }
    }
}
