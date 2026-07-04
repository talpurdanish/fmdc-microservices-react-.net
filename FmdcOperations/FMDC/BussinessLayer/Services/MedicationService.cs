using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Features.Medications.Commands.Create;
using FMDC.BussinessLayer.Features.Medications.Commands.Delete;
using FMDC.BussinessLayer.Features.Medications.Commands.Update;
using FMDC.BussinessLayer.Features.Medications.Queries.GetOne;
using FMDC.BussinessLayer.Features.Medications.Queries.List;
using FMDC.BussinessLayer.Interfaces;
using MediatR;

namespace FMDC.BussinessLayer.Services
{
    public class MedicationService : IMedicationService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public MedicationService(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }


        public async Task<MedicationViewModel?> GetMedication(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");

            var medication = await _sender.Send(new GetMedicationQuery(id));
            var viewModel = _mapper.Map<MedicationViewModel?>(medication) ?? throw new FmdcException("Medication could not be found");
            return viewModel;
        }

        public async Task<PagedResults<MedicationViewModel>> GetMedications(DataFilter filter)
        {

            var medications =  await _sender.Send(new ListMedicationQuery(filter));
            var data = _mapper.Map<IEnumerable<MedicationViewModel>>(medications.Data);

            return new PagedResults<MedicationViewModel>(data, medications.CurrentPage, medications.TotalRecords, medications.PageSize);
        }
     
        public async Task<bool> Update(MedicationViewModel viewmodel)
        {
            var model = await _sender.Send(new GetMedicationQuery(viewmodel.Code)) ?? throw new FmdcException("Medication could not be found");

            model.Description = viewmodel.Description;
            model.Name = viewmodel.Name;
            model.MedicationTypeId = viewmodel.TypeID;
            model.Brand = viewmodel.Brand;
            return await _sender.Send(new UpdateMedicationCommand(model));
        }

        public async Task<bool> Create(MedicationViewModel viewmodel)
        {
            var model = _mapper.Map<Medication>(viewmodel);

            return await _sender.Send(new CreateMedicationCommand(model));
        }

        public async Task<bool> Delete(int code)
        {
            try
            {
               return await _sender.Send(new DeleteMedicationCommand(code));
            }
            catch (Exception)
            {

                return false;
            }
        }

    }
}
