using Domain.Helpers;

using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IPatientService
    {
        Task<PatientViewModel?> GetPatient(int id);
        Task<PagedResults<PatientViewModel>> GetPatients(DataFilter filter);

        Task<bool> Create(PatientViewModel viewmodel);
        Task<bool> Update(PatientViewModel viewmodel);
        Task<bool> Delete(int id);

        Task<bool> CheckDuplicate(DuplicateType type, string value, int id = -1);

        Task<PatientStatViewModel?> GetStat();
        //Task<PatientButtons> GetButtons(int id);

        //Task<SlipViewModel> GenerateSlip(int id);
    }
}
