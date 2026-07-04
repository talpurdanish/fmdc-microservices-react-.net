using Domain.Helpers;
using Domain.Models;
using FMDC.BussinessLayer.Features.Receipts.Queries.Enums;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.List
{
    public class ListReceiptQueryHandler(FmdcOperationsContext context) : IRequestHandler<ListReceiptQuery, PagedResults<Receipt>>
    {
        public async Task<PagedResults<Receipt>> Handle(ListReceiptQuery request, CancellationToken cancellationToken)
        {
            var filter = request.Filter;
            IQueryable<Receipt> query = context.Receipts.Include(m => m.Appointment);

            if (request.Type == ReceiptListType.Unpaid) {
                query = query.Where(r => r.Paid == false);
            }
            else if (request.Type == ReceiptListType.Patient)
            {
                query = query.Where(r => r.PatientId ==  filter.Id);
            }

            query = ApplySort(filter.SortField, filter.Order, query);

            var totalRecords = await query.CountAsync(cancellationToken);

            var Receipts = filter.PageLess ? await query.ToListAsync(cancellationToken) : await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResults<Receipt>(Receipts, filter.Page, totalRecords, filter.PageSize);
        }

        //private static IQueryable<Receipt> ApplySearch(string? term, IQueryable<Receipt> query)
        //{
        //    if (string.IsNullOrWhiteSpace(term))
        //        return query;

        //    return query.Where(q => q.Name.Contains(term)  || q.ReceiptType.Name.Contains(term)
        //    );
        //}

        private static IQueryable<Receipt> ApplySort(string field, int order, IQueryable<Receipt> query)
        {
            bool ascending = order == 1;

            return field.ToLowerInvariant() switch
            {
                "id" => ascending ? query.OrderBy(p => p.Id) : query.OrderByDescending(p => p.Id),
                "grandtotal" => ascending ? query.OrderBy(p => p.GrandTotal) : query.OrderByDescending(p => p.GrandTotal),
                _ => query.OrderBy(p => p.Id)
            };
        }
    }
}
