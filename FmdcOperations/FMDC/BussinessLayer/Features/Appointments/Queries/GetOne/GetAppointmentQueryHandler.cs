using AutoMapper;
using Domain.Viewmodels;
using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Queries.GetOne
{
    public class GetAppointmentQueryHandler(FmdcOperationsContext context, IMapper mapper) : IRequestHandler<GetAppointmentQuery, AppointmentViewModel?>
    {
        public async Task<AppointmentViewModel?> Handle(GetAppointmentQuery request, CancellationToken cancellationToken)
        {
            if (request is null || request.Id <= 0)
                return null;

            var appointment = await context.Appointments.FindAsync([request.Id], cancellationToken);
            if (appointment is null)
            {
                return null;
            }
            var viewmodel = mapper.Map<AppointmentViewModel?>(appointment);
            return viewmodel;
        }
    }
}
