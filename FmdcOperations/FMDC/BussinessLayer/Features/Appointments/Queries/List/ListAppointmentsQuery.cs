using Domain.Helpers;
using Domain.Models;
using MediatR;
using FMDC.BussinessLayer.Features.Appointments.Queries.Enums;

namespace FMDC.BussinessLayer.Features.Appointments.Queries.List
{
    public record ListAppointmentsQuery(DataFilter Filter, AppointmentListType Type) : IRequest<PagedResults<Appointment>>;
}
