using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Features.Receipts.Commands.Create;
using FMDC.BussinessLayer.Features.Receipts.Commands.Delete;
using FMDC.BussinessLayer.Features.Receipts.Commands.Update;
using FMDC.BussinessLayer.Features.Receipts.Queries.Details;
using FMDC.BussinessLayer.Features.Receipts.Queries.Enums;
using FMDC.BussinessLayer.Features.Receipts.Queries.GetReceipt;
using FMDC.BussinessLayer.Features.Receipts.Queries.GetStats;
using FMDC.BussinessLayer.Features.Receipts.Queries.List;
using FMDC.BussinessLayer.Features.Receipts.Queries.ReceiptProcedures;
using MediatR;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IReceiptService
    {
        Task<ReceiptViewModel?> GetReceipt(int id);
        Task<PagedResults<ReceiptViewModel>> GetReceipts(DataFilter filter);
        Task<PagedResults<ReceiptViewModel>> GetUnpaidReceipts(DataFilter filter);
        Task<IEnumerable<ReceiptDetailViewModel>> GetDetails(int id = 0);
        Task<PagedResults<ReceiptViewModel>> GetPatientReceipts(DataFilter filter);
        Task<bool> Create(ReceiptViewModel viewmodel);
        Task<bool> Delete(int id);
        Task<bool> UpdatePaidStatus(int id);
        Task<IncomeStatsViewModel?> GetStat(int id = -1);
        Task<ReceiptViewModel?> GenerateReceipt(int id);

    }
}
