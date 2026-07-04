using FMDC.BussinessLayer.Features.Appointments.Queries.DTOs;
using FMDC.BussinessLayer.Features.Appointments.Queries.Enums;
using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Queries.GetStats
{
    public class AppointmentStatsQueryHandler(FmdcOperationsContext context) : IRequestHandler<AppointmentStatsQuery, AppointmentStatistics>
    {
        public async Task<AppointmentStatistics> Handle(AppointmentStatsQuery request, CancellationToken cancellationToken)
        {
            if (request.Type == AppointmentStatsType.All)
            {
                return await GetStats();
            }
            else
            {
                return await GetDoctorStats(request.DoctorId);
            }

        }

        private async Task<AppointmentStatistics> GetStats()
        {

            var curDate = DateTime.Now;
            var selDate = new DateTime(curDate.Year, curDate.Month, curDate.Day, 0, 0, 0, 0);
            // Today's pending appointments
            var todaysPending = context.Appointments.Count(a =>
                a.EndTime == null &&
                a.Date.Date == curDate);

            // Today's total appointments
            var todaysTotal = context.Appointments.Count(a =>
                a.Date.Date == curDate);

            // All pending appointments
            var pending = context.Appointments.Count(a =>
                a.EndTime == null);

            // All appointments
            var total = context.Appointments.Count();

            return new AppointmentStatistics() { TodayPending = todaysPending, TodayTotal = todaysTotal, Pending = pending, Total = total };

        }

        private async Task<AppointmentStatistics> GetDoctorStats(int doctorId)
        {

            var curDate = DateTime.Now;
            var selDate = new DateTime(curDate.Year, curDate.Month, curDate.Day, 0, 0, 0, 0);
            // Today's pending appointments
            var todaysPending = context.Appointments.Count(a =>
                  a.EndTime == null &&
                a.Date.Date == curDate && a.UserId == doctorId);

            // Today's total appointments
            var todaysTotal = context.Appointments.Count(a =>
                a.Date.Date == curDate && a.UserId == doctorId);

            // All pending appointments
            var pending = context.Appointments.Count(a =>
                 a.EndTime == null && a.UserId == doctorId);

            // All appointments
            var total = context.Appointments.Count(a => a.UserId == doctorId);

            return new AppointmentStatistics() { TodayPending = todaysPending, TodayTotal = todaysTotal, Pending = pending, Total = total };

        }
    }
}
