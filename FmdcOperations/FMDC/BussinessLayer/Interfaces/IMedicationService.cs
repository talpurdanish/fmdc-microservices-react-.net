using Domain.Helpers;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IMedicationService
    {

        Task<MedicationViewModel?> GetMedication(int id);
        Task<PagedResults<MedicationViewModel>> GetMedications(DataFilter filter);

        Task<bool> Create(MedicationViewModel viewmodel);
        Task<bool> Update(MedicationViewModel viewmodel);
        Task<bool> Delete(int code);

    }
}
