using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IReportService
    {

        Task<LabReportViewModel?> GetReport(int id);

        Task<PagedResults<LabReportViewModel>> GetReports(DataFilter filter);

        Task<PagedResults<LabReportViewModel>> GetPatientReports(DataFilter filter);

        Task<bool> Update(LabReportViewModel viewmodel);
        Task<bool> UpdateValues(AddReportValues reportValues);
        Task<IEnumerable<TestParameter>?> GetPendingParameters(int id);
        Task<bool> Create(LabReportViewModel viewmodel);
        Task<bool> Delete(int id);
        Task<PagedResults<LabReportViewModel>> GetPendingReports();
    }
}
