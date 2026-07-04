using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Clients;
using FMDC.BussinessLayer.Features.Reports.Commands.Create;
using FMDC.BussinessLayer.Features.Reports.Commands.Delete;
using FMDC.BussinessLayer.Features.Reports.Commands.Update;
using FMDC.BussinessLayer.Features.Reports.Commands.UpdateValues;
using FMDC.BussinessLayer.Features.Reports.Queries.DTOs;
using FMDC.BussinessLayer.Features.Reports.Queries.Enums;
using FMDC.BussinessLayer.Features.Reports.Queries.GetOne;
using FMDC.BussinessLayer.Features.Reports.Queries.List;
using FMDC.BussinessLayer.Features.Reports.Queries.MaxReportNumber;
using FMDC.BussinessLayer.Features.Reports.Queries.PendingParameters;
using FMDC.BussinessLayer.Features.Reports.Queries.StatusValuePair;
using FMDC.BussinessLayer.Features.TestParameters.Queries.List;
using FMDC.BussinessLayer.Interfaces;
using MediatR;
using System.Globalization;

namespace FMDC.BussinessLayer.Services
{
    public class ReportService : IReportService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;
        private readonly IClientService _clientService;
        public ReportService(ISender sender, IMapper mapper, IClientService clientService)
        {
            _sender = sender;
            _mapper = mapper;
            _clientService = clientService;

        }

        public async Task<LabReportViewModel?> GetReport(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");

            var labReport = await _sender.Send(new GetReportQuery(id)) ?? throw new FmdcException("Report could not be found");

            var viewModel = _mapper.Map<LabReportViewModel>(labReport);
            var user = await _clientService.GetUserAsync(labReport.DoctorId);
            var patient = await _clientService.GetPatientAsync(labReport.PatientId);

            if (user != null)
            {

                viewModel.DoctorId = user!.Id;
                viewModel.Doctor = user.Name ?? "";
                viewModel.DoctorPMDCNo = user.PMDCNo ?? "";
            }
            if (patient != null)
            {
                viewModel.PatientId = patient!.Id;
                viewModel.PatientName = patient.Name;
                viewModel.PatientNumber = patient.PatientNumber;
                viewModel.PatientAge = new Age(patient.DateofBirth).AgeString;
                viewModel.PatientGender = patient.Gender;
            }
            var paramResults = await _sender.Send(new ListTestParameterQuery(new DataFilter() { Id = viewModel.TestId }));
            var parameters = paramResults.Data;
            if (parameters != null && parameters.Any())
            {
                var paramViewModels = _mapper.Map<IEnumerable<TestParameterViewModel>>(parameters);

                var statusValuePairs = await _sender.Send(new StatusValueQuery(viewModel.Id, viewModel.TestId, StatusValuePairType.ByTestId));
                foreach (var param in paramViewModels)
                {
                    StatusValuePairModel? statusValuePair = statusValuePairs.FirstOrDefault(s => s.TestParameterId == param.Id);
                    if (statusValuePair != null)
                    {
                        param.Status = statusValuePair.Status;
                        param.Value = statusValuePair.Value;
                    }
                    viewModel.TestParameters.Add(param);
                }

            }
            return viewModel;
        }

        private async Task<PagedResults<LabReportViewModel>> FetchReports(DataFilter filter, ReportsListType Type = ReportsListType.All)
        {

            var labReports = await _sender.Send(new ListReportsQuery(filter)) ?? throw new FmdcException("Reports could not be fetched");

            var viewModels = _mapper.Map<IEnumerable<LabReportViewModel>>(labReports.Data);

            var userIds = viewModels.Select(u => u.DoctorId).ToList();
            var users = await _clientService.GetUsersAsync(userIds);

            var patientIds = viewModels.Select(p => p.PatientId).ToList();
            var patients = await _clientService.GetPatientsAsync(patientIds);


            foreach (var viewModel in viewModels)
            {

                if (users is not null)
                {
                    var user = users.FirstOrDefault(u => u.Id == viewModel.DoctorId);

                    if (user != null)
                    {
                        viewModel.DoctorId = user.Id;
                        viewModel.Doctor = user.Name ?? "";
                        viewModel.DoctorPMDCNo = user.PMDCNo ?? "";
                    }
                }
                if (patients is not null)
                {

                    var patient = patients.FirstOrDefault(u => u.Id == viewModel.PatientId);
                    if (patient is not null)
                    {
                        viewModel.PatientId = patient!.Id;
                        viewModel.PatientName = patient.Name;
                        viewModel.PatientNumber = patient.PatientNumber;
                        viewModel.PatientAge = new Age(patient.DateofBirth).AgeString;
                        viewModel.PatientGender = patient.Gender;
                    }

                }
                DataFilter pFilter = new()
                {
                    Id = viewModel.TestId,
                    PageLess = true,
                };
                var paramResults = await _sender.Send(new ListTestParameterQuery(new DataFilter() { Id = viewModel.TestId }));
                var parameters = paramResults.Data;
                if (parameters != null && parameters.Any())
                {
                    var paramViewModels = _mapper.Map<IEnumerable<TestParameterViewModel>>(parameters);

                    var statusValuePairs = await _sender.Send(new StatusValueQuery(viewModel.Id, viewModel.TestId, StatusValuePairType.ByTestId));
                    foreach (var param in paramViewModels)
                    {
                        StatusValuePairModel? statusValuePair = statusValuePairs.FirstOrDefault(s => s.TestParameterId == param.Id);
                        if (statusValuePair != null)
                        {
                            param.Status = statusValuePair.Status;
                            param.Value = statusValuePair.Value;
                        }
                        viewModel.TestParameters.Add(param);
                    }

                }
            }
            return new PagedResults<LabReportViewModel>(viewModels, labReports.CurrentPage,labReports.TotalRecords, labReports.PageSize);

        }
        public async Task<PagedResults<LabReportViewModel>> GetReports(DataFilter filter)
        {
            return await FetchReports(filter);
        }
      
        public async Task<PagedResults<LabReportViewModel>> GetPatientReports(DataFilter filter)
        {
            return await FetchReports(filter, ReportsListType.Patient);
        }

        public async Task<bool> Update(LabReportViewModel viewmodel)
        {
            try
            {
                string[] format = new string[] { "hhmm", @"hh\:mm" };
                var model = await _sender.Send(new GetReportQuery(viewmodel.Id)) ?? throw new FmdcException("Report could not be found");

                var now = DateTime.Now;
                var deliveryDate = DateTime.Parse(viewmodel.ReportDeliveryDate, CultureInfo.InvariantCulture);
                model.PatientId = viewmodel.PatientId;
                model.ReportDate = DateOnly.FromDateTime(now);
                model.ReportTime = TimeOnly.FromDateTime(now);
                model.ReportDeliveryDate = DateOnly.FromDateTime(deliveryDate);
                model.ReportDeliveryTime = TimeOnly.FromDateTime(deliveryDate); 
                model.TestId = viewmodel.TestId;
                model.DoctorId = viewmodel.DoctorId;
                return await _sender.Send(new UpdateReportCommand(model));
            }
            catch (Exception)
            {

                return false;
            }
        }
        public async Task<bool> UpdateValues(AddReportValues reportValues)
        {

            try
            {
                return await _sender.Send(new UpdateValuesCommand(reportValues));
            }
            catch (Exception)
            {

                return false;
            }
        }
        public async Task<IEnumerable<TestParameter>?> GetPendingParameters(int id)
        {
            return await _sender.Send(new PendingParametersQuery(id));
        }
        public async Task<bool> Create(LabReportViewModel viewmodel)
        {
            try
            {
                var previousId = await _sender.Send(new GetMaxQuery());
                var model = _mapper.Map<LabReport>(viewmodel);

                model.ReportNumber = previousId + 1;

                return await _sender.Send(new CreateReportCommand(model));
            }
            catch (Exception)
            {

                return false;
            }
        }
        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeleteReportCommand(id));

            }
            catch (Exception)
            {

                return false;
            }
        }
        public async Task<PagedResults<LabReportViewModel>> GetPendingReports()
        {
            DataFilter filter = new();
            var reports = await FetchReports(filter, ReportsListType.Pending);
            
            return reports;
        }
    }
   
}
