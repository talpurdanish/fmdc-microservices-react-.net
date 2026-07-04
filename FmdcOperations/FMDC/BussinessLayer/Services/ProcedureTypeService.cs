using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Create;
using FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Delete;
using FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Update;
using FMDC.BussinessLayer.Features.ProcedureTypes.Queries.GetOne;
using FMDC.BussinessLayer.Features.ProcedureTypes.Queries.List;
using FMDC.BussinessLayer.Interfaces;
using MediatR;

namespace FMDC.BussinessLayer.Services
{
    public class ProcedureTypeService : IProcedureTypeService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public ProcedureTypeService(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }



        public async Task<ProcedureTypeViewModel?> GetProcedureType(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");

            var ProcedureType = await _sender.Send(new GetProcedureTypeQuery(id)) ?? throw new FmdcException("Procedure Type Could not be found");
            return _mapper.Map<ProcedureTypeViewModel>(ProcedureType);
        }

        public async Task<PagedResults<ProcedureTypeViewModel>> GetProcedureTypes(DataFilter filter)
        {
            var types = await _sender.Send(new ListProcedureTypeQuery(filter));
            var data = _mapper.Map<IEnumerable<ProcedureTypeViewModel>>(types.Data);

            return new PagedResults<ProcedureTypeViewModel>(data, types.CurrentPage, types.TotalRecords, types.PageSize);
        }

        public async Task<bool> Update(ProcedureTypeViewModel viewmodel)
        {
            var model = await _sender.Send(new GetProcedureTypeQuery(viewmodel.Id)) ?? throw new FmdcException("ProcedureType could not be found");
            model.Name = viewmodel.Name;
            return await _sender.Send(new UpdateProcedureTypeCommand(model));
        }

        public async Task<bool> Create(ProcedureTypeViewModel viewmodel)
        {
            var model = _mapper.Map<ProcedureType>(viewmodel);
            return await _sender.Send(new CreateProcedureTypeCommand(model));
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeleteProcedureTypeCommand(id));
            }
            catch (Exception)
            {
                return false;
            }
        }

    }
}
