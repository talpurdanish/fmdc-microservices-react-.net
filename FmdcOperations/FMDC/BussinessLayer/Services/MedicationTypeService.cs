using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Features.MedicationTypes.Commands.Create;
using FMDC.BussinessLayer.Features.MedicationTypes.Commands.Delete;
using FMDC.BussinessLayer.Features.MedicationTypes.Commands.Update;
using FMDC.BussinessLayer.Features.MedicationTypes.Queries.GetOne;
using FMDC.BussinessLayer.Features.MedicationTypes.Queries.List;
using FMDC.BussinessLayer.Interfaces;
using MediatR;

namespace FMDC.BussinessLayer.Services
{
    public class MedicationTypeService : IMedicationTypeService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public MedicationTypeService(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }



        public async Task<MedicationTypeViewModel?> GetMedicationType(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");

            var medicationType = await _sender.Send(new GetMedicationTypeQuery(id)) ?? throw new FmdcException("Medication Type Could not be found");
            return _mapper.Map<MedicationTypeViewModel>(medicationType);
        }

        public async Task<PagedResults<MedicationTypeViewModel>> GetMedicationTypes(DataFilter filter)
        {
            var types = await _sender.Send(new ListMedicationTypeQuery(filter));
            var data = _mapper.Map<IEnumerable<MedicationTypeViewModel>>(types.Data);

            return new PagedResults<MedicationTypeViewModel>(data, types.CurrentPage, types.TotalRecords, types.PageSize);
        }
       
        public async Task<bool> Update(MedicationTypeViewModel viewmodel)
        {
            var model = await _sender.Send(new GetMedicationTypeQuery(viewmodel.Id)) ?? throw new FmdcException("MedicationType could not be found");
            model.Name = viewmodel.Name;
            return await _sender.Send(new UpdateMedicationTypeCommand(model));
        }

        public async Task<bool> Create(MedicationTypeViewModel viewmodel)
        {
            var model = _mapper.Map<MedicationType>(viewmodel);
            return await _sender.Send(new CreateMedicationTypeCommand(model));
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeleteMedicationTypeCommand(id));
            }
            catch (Exception)
            {
                return false;
            }
        }

    }
}
