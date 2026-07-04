using Domain.Helpers;
using Domain.Models;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.Enums;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Prescriptions.Queries.List
{
    public class ListPrescriptionQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListPrescriptionQuery, PagedResults<Prescription>>
    {
        public async Task<PagedResults<Prescription>> Handle(ListPrescriptionQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            IQueryable<Prescription> query = context.Prescriptions.Include(m => m.Appointment);

            if (request.Type == PrescriptionListType.Patient) {
                query = query.Where(p => p.Appointment!= null && p.Appointment.PatientId == filter.Id);
            }

            //query = ApplySearch(filter.Term, query);

            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var Prescriptions = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<Prescription>(Prescriptions, filter.Page, totalRecords, filter.PageSize);
        }

        //private static IQueryable<Prescription> ApplySearch(string? term, IQueryable<Prescription> query)
        //{
        //    if (string.IsNullOrWhiteSpace(term))
        //        return query;

        //    return query.Where(q => q.Name.Contains(term)  || q.PrescriptionType.Name.Contains(term)
        //    );
        //}

        private static IQueryable<Prescription> ApplySort(string field, int order, IQueryable<Prescription> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "doctor" => order == 1 ? query.OrderBy(p => p.Appointment!.UserId) : query.OrderByDescending(p => p.Appointment!.UserId),
                "patientname" => order == 1 ? query.OrderBy(p => p.Appointment!.PatientId) : query.OrderByDescending(p => p.Appointment!.PatientId),
                "date" => order == 1 ? query.OrderBy(p => p.Appointment!.Date) : query.OrderByDescending(p => p.Appointment!.Date),
                "starttime" => order == 1 ? query.OrderBy(p => p.Appointment!.StartTime) : query.OrderByDescending(p => p.Appointment!.StartTime),
                _ => query.OrderBy(p => p.Id)
            };
        }
    }
}
