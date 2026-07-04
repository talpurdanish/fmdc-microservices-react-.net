using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels.Users;

namespace FMDC.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {

            CreateMap<UserMissingDetailsViewModel, User>()
                .ForMember(dest => dest.Username, act => act.Ignore())
                .ForMember(dest => dest.Name, act => act.Ignore())
                .ForMember(dest => dest.Created, act => act.Ignore())
                .ForMember(dest => dest.IsActive, act => act.Ignore())
                .ForMember(dest => dest.Password, act => act.Ignore())
                .ForMember(dest => dest.PasswordSalt, act => act.Ignore());


            CreateMap<CreateUserViewModel, User>()
                .ForMember(dest => dest.Created, act => act.Ignore())
                .ForMember(dest => dest.IsActive, act => act.Ignore())
                .ForMember(dest => dest.Id, act => act.Ignore())
                .ForMember(dest => dest.Picture, act => act.Ignore())
                .ForMember(dest => dest.Password, act => act.Ignore())
                .ForMember(dest => dest.PasswordSalt, act => act.Ignore());

            CreateMap<UpdateUserViewModel, User>()
                .ForMember(dest => dest.Created, act => act.Ignore())
                .ForMember(dest => dest.IsActive, act => act.Ignore())
                .ForMember(dest => dest.Picture, act => act.Ignore())
                .ForMember(dest => dest.Password, act => act.Ignore())
                .ForMember(dest => dest.PasswordSalt, act => act.Ignore());


            CreateMap<User, UserViewModel>()
                .ForMember(dest => dest.Created, act => act.MapFrom(src => GetCreatedDate(src.Id, src.Created)))
                .ForMember(dest => dest.Id, src => src.MapFrom(s => s.Id))
                .ForMember(dest => dest.City, src => src.MapFrom(s => s.City!.Name))
                .ForMember(dest => dest.City, src => src.DoNotAllowNull())
                .ForMember(dest => dest.Province, src => src.MapFrom(s => s.City != null && s.City.Province != null ? s.City.Province.Name : ""))
                .ForMember(dest => dest.ProvinceId, src => src.MapFrom(s => s.City != null && s.City.Province != null ? s.City.Province.Id : -1))
                .ForMember(dest => dest.Picture, src => src.MapFrom(s => GetPicture(s.Picture)))
                .ForMember(dest => dest.Status, src => src.MapFrom(s=>GetUserStatus(s)));

        }

        private static bool GetUserStatus(User user) {
            var doctorStatus = !string.IsNullOrEmpty(user.PMDCNo) && user.Fees > 0;
            var allUsersStatus =  !string.IsNullOrEmpty(user.CNIC) && !string.IsNullOrEmpty(user.PhoneNo) && user.CityId > 0;
            return user.Role == Roles.Doctor ? doctorStatus && allUsersStatus : allUsersStatus;
        }



        private static DateTime GetCreatedDate(int UserId, DateTime Created)
        {
            return UserId == -1 ? DateTime.Now : Created;
        }

        private static string GetPicture(byte[]? picture)
        {
            return picture != null ? String.Format(System.Globalization.CultureInfo.InvariantCulture, "data:image/png;base64,{0}", Convert.ToBase64String(picture)) : "";
        }


    }
}
