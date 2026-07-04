using AutoMapper;
using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.Profiles
{
    public class ProcedureProfile:Profile
    {

        public ProcedureProfile()
        {
            CreateMap<Procedure, ProcedureViewModel>()
                .ForMember(dest=>dest.Type, src=>src.MapFrom(s=>s.ProcedureType!.Name))
                .ForMember(dest => dest.TypeID, src => src.MapFrom(s => s.ProcedureTypeId));


            CreateMap<ProcedureViewModel, Procedure>()
                .ForMember(dest => dest.ProcedureType, src => src.Ignore())
                .ForMember(dest => dest.ProcedureTypeId, src => src.MapFrom(s => s.TypeID));
        }
    }

    public class ProcedureTypeProfile : Profile
    {

        public ProcedureTypeProfile()
        {
            CreateMap<ProcedureType, ProcedureTypeViewModel>().ReverseMap();
        }
    }
}
