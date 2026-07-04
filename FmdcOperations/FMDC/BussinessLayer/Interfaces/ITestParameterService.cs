using Domain.Helpers;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface ITestParameterService
    {

        Task<TestParameterViewModel?> GetTestParameter(int id);
        Task<PagedResults<TestParameterViewModel>> GetTestParameters(DataFilter filter);
        Task<IEnumerable<TestParameterViewModel>> GetTestParameters(int testId);

        Task<bool> Create(TestParameterViewModel viewmodel);
        Task<bool> Update(TestParameterViewModel viewmodel);

        Task<bool> Delete(int id);

    }
}
