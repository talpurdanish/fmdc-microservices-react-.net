using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Clients;
using FMDC.BussinessLayer.Features.Prescriptions.Commands.Create;
using FMDC.BussinessLayer.Features.Prescriptions.Commands.Delete;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.Enums;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.GetOne;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.List;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.Tests;

using FMDC.BussinessLayer.Interfaces;
using MediatR;
using System.Globalization;

namespace FMDC.BussinessLayer.Services
{
    public class PrescriptionService : IPrescriptionService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;
        private readonly IClientService _clientService;
        public PrescriptionService(ISender sender, IMapper mapper, IClientService clientService)
        {
            _sender = sender;
            _mapper = mapper;
            _clientService = clientService;

        }

        public async Task<PrescriptionViewModel?> GetPrescription(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");


            var prescription = await _sender.Send(new GetPrescriptionQuery(id)) ?? throw new FmdcException("Appointment could not be found");
            var viewModel = _mapper.Map<PrescriptionViewModel>(prescription) ?? throw new FmdcException("Appointment could not be found");
            if (prescription.Appointment != null)
            {
                var user = await _clientService.GetUserAsync(prescription.Appointment.UserId);
                var patient = await _clientService.GetPatientAsync(prescription.Appointment.PatientId);
                if (user is not null)
                {
                    viewModel.Doctor = user.Name ?? "";
                }

                if (patient is not null)
                {
                    viewModel.PatientName = patient.Name;
                    viewModel.PatientNumber = patient.PatientNumber;
                    viewModel.PatientId = patient.Id;
                }
            }


            return viewModel;
        }

        private async Task<PagedResults<PrescriptionViewModel>> FetchPrescriptions(DataFilter filter, PrescriptionListType Type = PrescriptionListType.All)
        {
            var prescriptions = await _sender.Send(new ListPrescriptionQuery(filter, Type));
            var viewModels = _mapper.Map<IEnumerable<PrescriptionViewModel>>(prescriptions);

            var userIds = viewModels.Select(v => v.DoctorId).ToList();
            var users = await _clientService.GetUsersAsync(userIds);

            var patientIds = viewModels.Select(v => v.PatientId).ToList();
            var patients = await _clientService.GetPatientsAsync(patientIds);

            foreach (var model in viewModels)
            {
                if (patients is not null)
                {
                    var patient = patients.FirstOrDefault(p => p.Id == model.PatientId);
                    model.PatientName = patient?.Name ?? "";
                    model.PatientNumber = patient?.PatientNumber ?? "";
                    model.PatientId = patient?.Id ?? -1;
                }

                if (users is not null)
                {
                    var user = users.FirstOrDefault(u => u.Id == model.DoctorId);
                    model.Doctor = user?.Name ?? "";
                    model.DoctorId = user?.Id ?? -1;
                }
            }

            return new PagedResults<PrescriptionViewModel>(viewModels, prescriptions.CurrentPage, prescriptions.TotalRecords, prescriptions.PageSize);
        }
        public async Task<PagedResults<PrescriptionViewModel>> GetPrescriptions(DataFilter filter)
        {

            return await FetchPrescriptions(filter);



        }

        public async Task<PagedResults<PrescriptionViewModel>> GetPatientPrescriptions(DataFilter filter)
        {

            if (filter.Id <= 0)
                throw new FmdcException("Id is not valid");
            return await FetchPrescriptions(filter, PrescriptionListType.Patient);

        }


        public async Task<bool> Create(AddPrescriptionViewModel viewmodel)
        {
            var model = _mapper.Map<Prescription>(viewmodel);

            return await _sender.Send(new CreatePrescriptionCommand(model, viewmodel.Medications, viewmodel.Tests));

        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeletePrescriptionCommand(id));
            }
            catch (Exception)
            {

                return false;
            }
        }

        public async Task<SlipViewModel> GeneratePrescription(int id)
        {

            if (id <= 0)
            {
                throw new FmdcException("Id is not valid");
            }

            var prescription = await _sender.Send(new GetPrescriptionQuery(id)) ?? throw new FmdcException("Prescription could not be found");
            if (prescription.Appointment is null)
            {
                throw new FmdcException("Appointment could not be found");
            }
            var pres = _mapper.Map<Prescription>(prescription);
            var a = prescription.Appointment;
            var u = await _clientService.GetUserAsync(prescription.Appointment!.UserId);
            var p = await _clientService.GetPatientAsync(prescription.Appointment.PatientId);


            var slip = new SlipViewModel
            {
                Date = a.Date.ToString("dd-MMM-yyyy", CultureInfo.InvariantCulture),
                Number = pres.Id.ToString("d8", CultureInfo.InvariantCulture),
                Medstrings = await GenerateMedicationList(pres.Id),
                Tests = [.. (await GenerateLabTestsList(pres.Id))],
                Diagnosis = pres.Diagnosis,
                Remarks = pres.Remarks,
                Bp = pres.Bp,
                Bsr = pres.Bsr,
                Pulse = pres.Pulse,
                Temp = pres.Temp,
                Wt = pres.Wt,
                Ht = pres.Ht,
            };

            if (u is not null)
            {
                slip.Doctor = u.Name ?? "";
            }

            if (p is not null)
            {

                var c = await _clientService.GetCityAsync(p.CityId);
                if (c is not null)
                {
                    slip.City = c.Name ?? "";
                }

                slip.Name = p.Name;
                slip.FatherName = p.FatherName ?? "";
                slip.Address = p.Address ?? "";

                slip.BloodGroup = p.BloodGroup ?? "";
                slip.Age = new Age(p.DateofBirth).AgeString;
                slip.PhoneNo = p.PhoneNo ?? "";
                slip.PatientNumber = p.PatientNumber;
            }

            return slip;
        }
      
        private async Task<List<PrescriptionMedicationViewModel>> GenerateMedicationList(int pId)
        {

            var medications = await _sender.Send(new ListPrescriptionMedicationQuery(pId));
            var viewModels = _mapper.Map<List<PrescriptionMedicationViewModel>>(medications);
            return viewModels;
        }

        private async Task<IEnumerable<string>> GenerateLabTestsList(int pId)
        {
            return await _sender.Send(new ListPrescriptionTestsQuery(pId));
        }
    }
}
