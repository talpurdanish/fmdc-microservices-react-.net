using Domain.Helpers;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IProcedureTypeService
    {
        Task<ProcedureTypeViewModel?> GetProcedureType(int id);
        Task<PagedResults<ProcedureTypeViewModel>> GetProcedureTypes(DataFilter filter);

        Task<bool> Create(ProcedureTypeViewModel viewmodel);
        Task<bool> Update(ProcedureTypeViewModel viewmodel);
        Task<bool> Delete(int id);

    }
}
