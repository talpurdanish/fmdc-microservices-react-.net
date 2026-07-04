using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Clients;
using FMDC.BussinessLayer.Features.Receipts.Commands.Create;
using FMDC.BussinessLayer.Features.Receipts.Commands.Delete;
using FMDC.BussinessLayer.Features.Receipts.Commands.Update;
using FMDC.BussinessLayer.Features.Receipts.Queries.Details;
using FMDC.BussinessLayer.Features.Receipts.Queries.Enums;
using FMDC.BussinessLayer.Features.Receipts.Queries.GetReceipt;
using FMDC.BussinessLayer.Features.Receipts.Queries.GetStats;
using FMDC.BussinessLayer.Features.Receipts.Queries.List;
using FMDC.BussinessLayer.Features.Receipts.Queries.ReceiptProcedures;
using FMDC.BussinessLayer.Interfaces;
using MediatR;


namespace FMDC.BussinessLayer.Services
{
    public class ReceiptService : IReceiptService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;
        private readonly IClientService _clientService;
        public ReceiptService(ISender sender, IMapper mapper, IClientService clientService)
        {
            _sender = sender;
            _mapper = mapper;
            _clientService = clientService;

        }
        public async Task<ReceiptViewModel?> GetReceipt(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");

            var receipt = await _sender.Send(new GetReceiptQuery(id)) ?? throw new FmdcException("Appointment could not be found");
            var viewModel = _mapper.Map<ReceiptViewModel>(receipt) ?? throw new FmdcException("Appointment could not be found");
            var user = await _clientService.GetUserAsync(receipt.UserId);
            var patient = await _clientService.GetPatientAsync(receipt.PatientId);
            var authUser = await _clientService.GetUserAsync(receipt.AuthorizedById);

            if (user is not null)
            {
                viewModel.DoctorId = user.Id;
                viewModel.Doctor = user.Name ?? "";
            }

            if (patient is not null)
            {
                viewModel.PatientId = patient.Id;
                viewModel.PatientName = patient.Name;
                viewModel.PatientNumber = patient.PatientNumber;
            }

            if (authUser is not null)
            {
                viewModel.AuthorizedBy = authUser is null ? "" : authUser.Name ?? "";
                viewModel.AuthorizedById = authUser is null ? 0 : authUser.Id;
            }

            return viewModel;
        }
        private async Task<PagedResults<ReceiptViewModel>> FetchReceipts(DataFilter filter, ReceiptListType type = ReceiptListType.All)
        {
            var receipts = await _sender.Send(new ListReceiptQuery(filter, type));
            var viewModels = _mapper.Map<IEnumerable<ReceiptViewModel>>(receipts.Data);

            var userIds = viewModels.Select(v => v.DoctorId).ToList();
            var users = await _clientService.GetUsersAsync(userIds);

            var patientIds = viewModels.Select(v => v.PatientId).ToList();
            var patients = await _clientService.GetPatientsAsync(patientIds);

            var authUserIds = viewModels.Select(v => v.AuthorizedById).ToList();
            var authUsers = await _clientService.GetUsersAsync(authUserIds);

            foreach (var model in viewModels)
            {
                if (model.Appointment is not null)
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

                    if (authUsers is not null)
                    {

                        var authUser = authUsers.FirstOrDefault(u => u.Id == model.AuthorizedById);
                        model.AuthorizedBy = authUser is null ? "" : authUser.Name ?? "";
                        model.AuthorizedById = authUser is null ? 0 : authUser.Id;
                    }
                }
            }
            return new PagedResults<ReceiptViewModel>(viewModels, receipts.CurrentPage, receipts.TotalRecords, receipts.PageSize);
        }
        public async Task<PagedResults<ReceiptViewModel>> GetReceipts(DataFilter filter)
        {
            return await FetchReceipts(filter);
        }
        public async Task<PagedResults<ReceiptViewModel>> GetUnpaidReceipts(DataFilter filter)
        {
            return await FetchReceipts(filter, ReceiptListType.Unpaid);
        }
        public async Task<IEnumerable<ReceiptDetailViewModel>> GetDetails(int id = 0)
        {
            if (id <= 0)
            {
                throw new FmdcException("Id is not valid");
            }

            var detailIds = await _sender.Send(new ListReceiptDetailsQuery(id));

            // Batch load procedures and tests for all detailIds
            var procedures = await _sender.Send(new ListReceiptProceduresQuery(detailIds));
            var tests = await _sender.Send(new ListReceiptTestsQuery(detailIds));

            // Map procedures
            var procedureViewModels = procedures.Select(proc => new ReceiptDetailViewModel
            {
                ReceiptId = proc.ReceiptId,
                ProcedureId = proc.Procedure!.Id,
                TestId = 0,
                Detail = proc.Procedure.Name,
                Cost = proc.Procedure.Cost,
                Type = DetailType.procedure
            });

            // Map tests
            var testViewModels = tests.Select(test => new ReceiptDetailViewModel
            {
                ReceiptId = test.ReceiptId,
                ProcedureId = 0,
                TestId = test.Test!.Id,
                Detail = test.Test.Name,
                Cost = test.Test.Cost,
                Type = DetailType.test
            });

            // Combine results
            return [.. procedureViewModels, .. testViewModels];
        }
        public async Task<PagedResults<ReceiptViewModel>> GetPatientReceipts(DataFilter filter)
        {
            return await FetchReceipts(filter);
        }
        public async Task<bool> Create(ReceiptViewModel viewmodel)
        {
            var model = _mapper.Map<Receipt>(viewmodel);
            return await _sender.Send(new CreateReceiptCommand(model, viewmodel.ProceduresIds, viewmodel.TestsIds));
        }
        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeleteReceiptCommand(id));
            }
            catch (Exception)
            {

                return false;
            }

        }
        public async Task<bool> UpdatePaidStatus(int id)
        {
            if (id <= 0)
            {
                throw new FmdcException("Id is not valid");
            }
            return await _sender.Send(new UpdatePaidStatusCommand(id));
        }
        public async Task<IncomeStatsViewModel?> GetStat(int id = -1)
        {
            var statistics = id > 0 ? await _sender.Send(new ReceiptStatsQuery(ReceiptStatsType.All)) : await _sender.Send(new ReceiptStatsQuery(ReceiptStatsType.Doctor, id));
            return _mapper.Map<IncomeStatsViewModel?>(statistics);
        }
        public async Task<ReceiptViewModel?> GenerateReceipt(int id)
        {
            if (id <= 0)
                throw new FmdcException("Id is not valid");

            var receipt = await GetReceipt(id) ?? throw new FmdcException("Reciept cannot be found");
            var detailIds = await _sender.Send(new ListReceiptDetailsQuery(id));

            // Batch load procedures and tests for all detailIds
            var procedures = await _sender.Send(new ListReceiptProceduresQuery(detailIds));
            var tests = await _sender.Send(new ListReceiptTestsQuery(detailIds));

            // Map procedures
            var procedureViewModels = procedures.Select(proc => new ReceiptDetailViewModel
            {
                ReceiptId = proc.ReceiptId,
                ProcedureId = proc.Procedure!.Id,
                TestId = 0,
                Detail = proc.Procedure.Name,
                Cost = proc.Procedure.Cost,
                Type = DetailType.procedure
            });

            // Map tests
            var testViewModels = tests.Select(test => new ReceiptDetailViewModel
            {
                ReceiptId = test.ReceiptId,
                ProcedureId = 0,
                TestId = test.Test!.Id,
                Detail = test.Test.Name,
                Cost = test.Test.Cost,
                Type = DetailType.test
            });

            receipt.Items = [..procedureViewModels, ..testViewModels];
            return receipt;

        }
    }
}
