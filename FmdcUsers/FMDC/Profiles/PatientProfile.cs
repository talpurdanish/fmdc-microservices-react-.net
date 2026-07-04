using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;
using Microsoft.AspNetCore.Http.HttpResults;
using Org.BouncyCastle.Asn1.X509;
using Stripe;
using System.Xml.Linq;

namespace FMDC.Profiles
{
    public class PatientProfile : Profile
    {
        public PatientProfile()
        {
            CreateMap<PatientViewModel, Patient>()
                .ForMember(dest => dest.Created, act => act.MapFrom(src => GetCreatedDate(src.Id, src.Created)))
                 .ForMember(dest => dest.Id, act => act.Ignore())
                 .ForMember(dest => dest.City, act => act.Ignore())
                 .ForMember(dest => dest.Picture, act => act.Ignore());

            CreateMap<Patient, PatientViewModel>()
                .ForMember(dest => dest.Created, act => act.MapFrom(src => GetCreatedDate(src.Id, src.Created)))
                .ForMember(dest => dest.Id, src => src.MapFrom(s => s.Id))
                .ForMember(dest => dest.City, src => src.MapFrom(s => s.City != null ? s.City.Name : ""))
                .ForMember(dest => dest.City, src => src.DoNotAllowNull())
                .ForMember(dest => dest.Province, src => src.MapFrom(s => s.City != null && s.City.Province != null ? s.City.Province.Name : ""))
                .ForMember(dest => dest.Picture, src => src.MapFrom(s => GetPicture(s.Picture)));

        }
        private static DateTime GetCreatedDate(int id, DateTime Created)
        {
            return id == -1 ? DateTime.Now : Created;
        }

        private static string GetPicture(byte[]? picture)
        {
            return picture != null ? String.Format(System.Globalization.CultureInfo.InvariantCulture, "data:image/png;base64,{0}", Convert.ToBase64String(picture)) : "";
        }
    }
}
