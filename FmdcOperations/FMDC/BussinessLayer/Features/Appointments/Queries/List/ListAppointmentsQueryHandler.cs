using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;
using FMDC.BussinessLayer.Features.Appointments.Queries.Enums;

namespace FMDC.BussinessLayer.Features.Appointments.Queries.List
{
    public class ListAppointmentsQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListAppointmentsQuery, PagedResults<Appointment>>
    {
        public async Task<PagedResults<Appointment>> Handle(ListAppointmentsQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            IQueryable<Appointment> query = context.Appointments;

            if (request.Type == AppointmentListType.Pending)
            {
                query = query.Where(a => a.EndDate == null && a.EndTime == null && (filter.Id < 0 || a.UserId == filter.Id));
            }
            else if (request.Type == AppointmentListType.Patient)
            {
                query = query.Where(a => a.PatientId == filter.Id);
            }
            else if (request.Type == AppointmentListType.Doctor)
            {
                query = query.Where(a => a.UserId == filter.Id);
            }

            var totalRecords = await query.CountAsync(cancellationToken);

            query = ApplySort(filter.SortField, filter.Order, query);

            var Appointments = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<Appointment>(Appointments, filter.Page, totalRecords, filter.PageSize);

        }

        private static IQueryable<Appointment> ApplySort(string field, int order, IQueryable<Appointment> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "appointmentdate" => order == 1 ? query.OrderBy(p => p.Date) : query.OrderByDescending(p => p.Date),
                "starttime" => order == 1 ? query.OrderBy(p => p.StartTime) : query.OrderByDescending(p => p.StartTime),
                "appointmentenddate" => order == 1 ? query.OrderBy(p => p.EndDate) : query.OrderByDescending(p => p.EndDate),
                "endtime" => order == 1 ? query.OrderBy(p => p.EndTime) : query.OrderByDescending(p => p.EndTime),
                "doctorname" => order == 1 ? query.OrderBy(p => p.UserId) : query.OrderByDescending(p => p.UserId),
                "patientname" => order == 1 ? query.OrderBy(p => p.PatientId) : query.OrderByDescending(p => p.PatientId),
                _ => query.OrderBy(p => p.Id),
            };
        }
    }
}
