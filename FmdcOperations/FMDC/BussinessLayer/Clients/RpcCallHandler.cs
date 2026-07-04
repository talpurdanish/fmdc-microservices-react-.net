using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Clients
{



    public interface IRpcCallHandler
    {
        Task<UserViewModel?> GetUserAsync(int id);
        Task<PatientViewModel?> GetPatientAsync(int id);
        Task<CityViewModel?> GetCityAsync(int id);

    }
    public class RpcCallHandler(IRpcClientService rpcClientService):IRpcCallHandler
    {
        
        public async Task<UserViewModel?> GetUserAsync(int id)
        {
            string message = $"GetUser:{id}";
            return await rpcClientService.InvokeAsync<UserViewModel>(message);
        }

        public async Task<PatientViewModel?> GetPatientAsync(int id)
        {
            string message = $"GetPatient:{id}";
            return await rpcClientService.InvokeAsync<PatientViewModel>(message);
        }

        public async Task<CityViewModel?> GetCityAsync(int id)
        {
            string message = $"GetCity:{id}";
            return await rpcClientService.InvokeAsync<CityViewModel>(message);
        }
    }
}
