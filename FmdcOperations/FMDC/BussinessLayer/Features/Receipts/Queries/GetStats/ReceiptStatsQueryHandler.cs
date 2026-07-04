using FMDC.BussinessLayer.Features.Receipts.Queries.DTOs;
using FMDC.BussinessLayer.Features.Receipts.Queries.Enums;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.GetStats
{
    public class ReceiptStatsQueryHandler(FmdcOperationsContext context) : IRequestHandler<ReceiptStatsQuery, IncomeStatistics>
    {
        public async Task<IncomeStatistics> Handle(ReceiptStatsQuery request, CancellationToken cancellationToken)
        {
            if(request.Type == ReceiptStatsType.All)
            {
                return await GetStats();
            }
            else
            {
                return await GetDoctorStats(request.DoctorId);
            }

        }

        private async Task<IncomeStatistics> GetStats() {

            var curDate = DateTime.Now;
            var selDate = new DateTime(curDate.Year, curDate.Month, curDate.Day, 0, 0, 0, 0);

            var total = context.Receipts.Sum(r => r.GrandTotal);
            var todays = context.Receipts.Where(r => r.Date >= selDate).Sum(r => r.GrandTotal);

            var dates = await context.Receipts.Select(r => r.Date.ToString("dd/MM", System.Globalization.CultureInfo.InvariantCulture)).Distinct().ToListAsync();
            var result = await context.Receipts.GroupBy(r => r.Date.Date).Select(cl => cl.Sum(c => c.GrandTotal)).ToListAsync();

            return new IncomeStatistics
            {
                Total = total,
                Todays = todays,
                Labels = dates,
                Data = result
            };

        }

        private async Task<IncomeStatistics> GetDoctorStats(int doctorId) {

            var curDate = DateTime.Now;
            var selDate = new DateTime(curDate.Year, curDate.Month, curDate.Day, 0, 0, 0, 0);

            var total = context.Receipts.Where(r => r.Appointment!.UserId == doctorId).Sum(r => r.GrandTotal);
            var todays = context.Receipts.Where(r => r.Date >= selDate && r.Appointment!.UserId == doctorId).Sum(r => r.GrandTotal);

            var dates = await context.Receipts.Where(r => r.Appointment!.UserId == doctorId).Select(r => r.Date.ToString("dd/MM", System.Globalization.CultureInfo.InvariantCulture)).Distinct().ToListAsync();
            var result = await context.Receipts.Where(r => r.Appointment!.UserId == doctorId).GroupBy(r => r.Date.Date).Select(cl => cl.Sum(c => c.GrandTotal)).ToListAsync();

            return new IncomeStatistics
            {
                Total = total,
                Todays = todays,
                Labels = dates,
                Data = result
            };

        }
    }
}
