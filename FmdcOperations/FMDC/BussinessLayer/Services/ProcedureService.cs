using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Features.Procedures.Commands.Create;
using FMDC.BussinessLayer.Features.Procedures.Commands.Delete;
using FMDC.BussinessLayer.Features.Procedures.Commands.Update;
using FMDC.BussinessLayer.Features.Procedures.Queries.GetOne;
using FMDC.BussinessLayer.Features.Procedures.Queries.List;
using FMDC.BussinessLayer.Interfaces;
using MediatR;

namespace FMDC.BussinessLayer.Services
{
    public class ProcedureService : IProcedureService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public ProcedureService(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }


        public async Task<ProcedureViewModel?> GetProcedure(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");

            var Procedure = await _sender.Send(new GetProcedureQuery(id));
            var viewModel = _mapper.Map<ProcedureViewModel?>(Procedure) ?? throw new FmdcException("Procedure could not be found");
            return viewModel;
        }

        public async Task<PagedResults<ProcedureViewModel>> GetProcedures(DataFilter filter)
        {

            var Procedures = await _sender.Send(new ListProcedureQuery(filter));
            var data = _mapper.Map<IEnumerable<ProcedureViewModel>>(Procedures.Data);

            return new PagedResults<ProcedureViewModel>(data, Procedures.CurrentPage, Procedures.TotalRecords, Procedures.PageSize);
        }

        public async Task<bool> Update(ProcedureViewModel viewmodel)
        {
            var model = await _sender.Send(new GetProcedureQuery(viewmodel.Id)) ?? throw new FmdcException("Procedure could not be found");

            
            model.Name = viewmodel.Name;
            model.ProcedureTypeId = viewmodel.TypeID;
            model.Cost = viewmodel.Cost;
            

            return await _sender.Send(new UpdateProcedureCommand(model));
        }

        public async Task<bool> Create(ProcedureViewModel viewmodel)
        {
            var model = _mapper.Map<Procedure>(viewmodel);

            return await _sender.Send(new CreateProcedureCommand(model));
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeleteProcedureCommand(id));
            }
            catch (Exception)
            {

                return false;
            }
        }

    }
}
