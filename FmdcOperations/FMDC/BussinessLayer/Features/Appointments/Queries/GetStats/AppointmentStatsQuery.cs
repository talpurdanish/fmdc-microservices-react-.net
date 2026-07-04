using FMDC.BussinessLayer.Features.Appointments.Queries.DTOs;
using FMDC.BussinessLayer.Features.Appointments.Queries.Enums;
using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Queries.GetStats
{
    public record AppointmentStatsQuery(AppointmentStatsType Type, int DoctorId = -1) : IRequest<AppointmentStatistics>;
}
