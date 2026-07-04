using Domain.Helpers;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IMedicationTypeService
    {
        Task<MedicationTypeViewModel?> GetMedicationType(int id);
        Task<PagedResults<MedicationTypeViewModel>> GetMedicationTypes(DataFilter filter);

        Task<bool> Create(MedicationTypeViewModel viewmodel);
        Task<bool> Update(MedicationTypeViewModel viewmodel);
        Task<bool> Delete(int id);

    }
}
