using Domain.Viewmodels;

using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Queries.GetButtons
{
    public record AppointmentButtonsQuery(int PatientId) : IRequest<PatientButtons>;
}
