using AutoMapper;
using Domain.Helpers;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Clients;
using FMDC.BussinessLayer.Features.Appointments.Commands.AddEndDate;
using FMDC.BussinessLayer.Features.Appointments.Commands.Create;
using FMDC.BussinessLayer.Features.Appointments.Commands.Delete;
using FMDC.BussinessLayer.Features.Appointments.Queries.Enums;
using FMDC.BussinessLayer.Features.Appointments.Queries.GetButtons;
using FMDC.BussinessLayer.Features.Appointments.Queries.GetOne;
using FMDC.BussinessLayer.Features.Appointments.Queries.GetStats;
using FMDC.BussinessLayer.Features.Appointments.Queries.List;
using FMDC.BussinessLayer.Interfaces;
using MediatR;

namespace FMDC.BussinessLayer.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;
        private readonly IClientService _clientService;

        public AppointmentService(ISender sender, IMapper mapper, IClientService clientService)
        {
            _sender = sender;
            _mapper = mapper;
            _clientService = clientService;
        }

        public async Task<AppointmentViewModel?> GetAppointment(int id)
        {
            try
            {
                if (id <= 0)
                {
                    throw new FmdcException("Id is not valid");
                }
                var appointment = await _sender.Send(new GetAppointmentQuery(id)) ?? throw new FmdcException("Appointment could not be found");
                var viewModel = _mapper.Map<AppointmentViewModel>(appointment);
                var user = await _clientService.GetUserAsync(appointment.UserId);
                var patient = await _clientService.GetPatientAsync(appointment.PatientId);

                if (user is not null)
                {
                    viewModel.DoctorName = user?.Name ?? "";
                    viewModel.UserId = user?.Id ?? 0;
                }

                if (patient is not null)
                {
                    viewModel.PatientName = patient?.Name ?? "";
                    viewModel.PatientId = patient?.Id ?? 0;
                }


                return viewModel;
            }
            catch (Exception)
            {

                return null;
            }
        }

        private async Task<PagedResults<AppointmentViewModel>> FetchAppointments(DataFilter filter, AppointmentListType type = AppointmentListType.All)
        {
            var appointments = await _sender.Send(new ListAppointmentsQuery(filter, type));

            var viewModels = _mapper.Map<IEnumerable<AppointmentViewModel>>(appointments.Data);

            var userIds = viewModels.Select(u => u.UserId).ToList();
            var users = await _clientService.GetUsersAsync(userIds);

            var patientIds = viewModels.Select(p => p.PatientId).ToList();
            var patients = await _clientService.GetPatientsAsync(patientIds);

            foreach (var viewModel in viewModels)
            {
                if (users is not null)
                {
                    var user = users.FirstOrDefault(u => u.Id == viewModel.UserId);
                    viewModel.DoctorName = user?.Name ?? "";
                    viewModel.UserId = user?.Id ?? 0;
                }
                if (patients is not null)
                {
                    var patient = patients.FirstOrDefault(p => p.Id == viewModel.PatientId);
                    viewModel.PatientName = patient?.Name ?? "";
                    viewModel.PatientId = patient?.Id ?? 0;
                }
            }
            return new PagedResults<AppointmentViewModel>(viewModels,appointments.CurrentPage, appointments.TotalRecords, appointments.PageSize);
        }

        public async Task<PagedResults<AppointmentViewModel>> GetAppointments(DataFilter filter, int id = -1)
        {
            return await FetchAppointments(filter);

        }

        public async Task<bool> Create(AddAppointmentViewModel viewModel)
        {
            return await _sender.Send(new CreateAppointmentCommand(viewModel));
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                return await _sender.Send(new DeleteAppointmentCommand(id));
            }
            catch (Exception)
            {

                return false;
            }

        }

        public async Task<AppointmentStatViewModel?> GetStat(int id = -1)
        {
            if (id > 0)
            {
                var statistics = await _sender.Send(new AppointmentStatsQuery(AppointmentStatsType.All));
                return _mapper.Map<AppointmentStatViewModel>(statistics);

            }
            else
            {
                var statistics = await _sender.Send(new AppointmentStatsQuery(AppointmentStatsType.Doctor, id));
                return _mapper.Map<AppointmentStatViewModel>(statistics);
            }
        }

        public async Task<PagedResults<AppointmentViewModel>> GetPatientAppointments(DataFilter filter)
        {

            var appointments = await FetchAppointments(filter);
            return appointments;
        }

        public async Task<PagedResults<AppointmentViewModel>> GetPending(int id = -1)
        {
            DataFilter filter = new();
            if (id > 0)
                filter.Id = id;
            return await FetchAppointments(filter, AppointmentListType.Pending);
        }

        public async Task<bool> AddEndDate(int id, string? type = "p")
        {

            if (id <= 0)
            {
                throw new FmdcException("Id is not valid");
            }

            return await _sender.Send(new AddEndDateCommand(id, type));
        }
        public async Task<PatientButtons> GetButtons(int id)
        {
            return await _sender.Send(new AppointmentButtonsQuery(id));
        }
    }
}
