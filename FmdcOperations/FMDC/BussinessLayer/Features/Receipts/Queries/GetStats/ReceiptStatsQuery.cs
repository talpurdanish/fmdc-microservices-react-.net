using FMDC.BussinessLayer.Features.Receipts.Queries.DTOs;
using FMDC.BussinessLayer.Features.Receipts.Queries.Enums;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.GetStats
{
    public record ReceiptStatsQuery(ReceiptStatsType Type, int DoctorId = -1) : IRequest<IncomeStatistics>;
}
