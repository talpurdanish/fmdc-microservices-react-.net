using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Reports.Queries.List
{
    public class ListReportsQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListReportsQuery, PagedResults<LabReport>>
    {
        public async Task<PagedResults<LabReport>> Handle(ListReportsQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            IQueryable<LabReport> query = context.LabReports.Include(l => l.Test);

            if (request.Type == Enums.ReportsListType.Pending) {
                query = query.Where(r => r.Status == false);
            }
            else if (request.Type == Enums.ReportsListType.Patient)
            {
                query = query.Where(r => r.PatientId ==  filter.Id);
            }
            query = ApplySearch(filter.Term, query);
            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var Reports = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<LabReport>(Reports, filter.Page, totalRecords, filter.PageSize);
        }

        private static IQueryable<LabReport> ApplySearch(string? term, IQueryable<LabReport> query)
        {
            if (string.IsNullOrWhiteSpace(term))
                return query;

            return query.Where(q => q.Test!= null && q.Test.Name.Contains(term) 
            );
        }

        private static IQueryable<LabReport> ApplySort(string field, int order, IQueryable<LabReport> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "reportdate" => order == 1 ? query.OrderBy(p => p.ReportDate) : query.OrderByDescending(p => p.ReportDate),
                 "reporttime"=> order == 1 ? query.OrderBy(p => p.ReportTime) : query.OrderByDescending(p => p.ReportTime),
                 "reportdeliverydate"=> order == 1 ? query.OrderBy(p => p.ReportDeliveryDate) : query.OrderByDescending(p => p.ReportDeliveryDate),
                 "reportdeliverytime"=> order == 1 ? query.OrderBy(p => p.ReportDeliveryTime) : query.OrderByDescending(p => p.ReportDeliveryTime),
                 "testname"=> order == 1 ? query.OrderBy(p => p.TestId) : query.OrderByDescending(p => p.TestId),
                 "patientname"=> order == 1 ? query.OrderBy(p => p.PatientId) : query.OrderByDescending(p => p.PatientId),
                 "doctor"=> order == 1 ? query.OrderBy(p => p.DoctorId) : query.OrderByDescending(p => p.DoctorId),
                 "reportnumber"=> order == 1 ? query.OrderBy(p => p.ReportNumber) : query.OrderByDescending(p => p.ReportNumber),
                 "status"=> order == 1 ? query.OrderBy(p => p.Status) : query.OrderByDescending(p => p.Status),
                _ => query
            };
        }
    }
}
