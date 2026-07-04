using Domain.Helpers;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IProcedureService
    {

        Task<ProcedureViewModel?> GetProcedure(int id);
        Task<PagedResults<ProcedureViewModel>> GetProcedures(DataFilter filter);

        Task<bool> Create(ProcedureViewModel viewmodel);
        Task<bool> Update(ProcedureViewModel viewmodel);
        Task<bool> Delete(int id);

    }
}
