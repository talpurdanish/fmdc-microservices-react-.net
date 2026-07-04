using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.Profiles
{
    public class TestProfile:Profile
    {
        public TestProfile()
        {
            CreateMap<Test, TestViewModel>().ReverseMap();
        }
    }

    public class TestParameterProfile : Profile
    {
        public TestParameterProfile()
        {
            CreateMap<TestParameter, TestParameterViewModel>()
                .ForMember(dest => dest.TestName, src => src.MapFrom(s => s.Test!.Name));
            
            CreateMap<TestParameterViewModel, TestParameter>()
                .ForMember(dest => dest.Test, src => src.Ignore())
                .ForMember(dest => dest.TestId, src => src.MapFrom(s => s.TestId));
        }
    }
}
