using Domain.Helpers;
using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface ITestService
    {

        Task<TestViewModel?> GetTest(int id);
        Task<PagedResults<TestViewModel>> GetTests(DataFilter filter);

        Task<bool> Create(TestViewModel viewmodel);
        Task<bool> Update(TestViewModel viewmodel);
        Task<bool> Delete(int id);

    }
}
