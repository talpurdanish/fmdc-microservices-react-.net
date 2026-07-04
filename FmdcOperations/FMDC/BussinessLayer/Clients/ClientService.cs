using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using Newtonsoft.Json;

namespace FMDC.BussinessLayer.Clients
{

    public interface IClientService
    {
        Task<UserViewModel?> GetUserAsync(int id);
        Task<PatientViewModel?> GetPatientAsync(int id);
        Task<CityViewModel?> GetCityAsync(int id);
        Task<bool> SaveNotificationAsync(Notification notification);

    }
    public class ClientService:IClientService
    {
        HttpClient _httpClient;

        public ClientService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:6300/");
        }

       
        public async Task<UserViewModel?> GetUserAsync(int id)
        {
            return await GetDataAsync<UserViewModel>($"api/fmdc/users/{id}");

        }

        public async Task<PatientViewModel?> GetPatientAsync(int id)
        {
            return await GetDataAsync<PatientViewModel>($"api/fmdc/patients/{id}");
        }

        public async Task<CityViewModel?> GetCityAsync(int id)
        {
            return await GetDataAsync<CityViewModel>($"api/fmdc/cities/{id}");
        }

        public async Task<bool> SaveNotificationAsync(Notification notification)
        {
            var body = new StringContent(System.Text.Json.JsonSerializer.Serialize(notification), System.Text.Encoding.UTF8, "application/json");
            return await PostDataAsync<bool>("api/fmdc/notifications", body);
        }

        private async Task<T?> GetDataAsync<T>(string url)
        {
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var jsonString =  await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<FmdcResult<T>>(jsonString);
            if (result == null || result.Error)
            {
                /*throw new FmdcException(result?.Message ?? "Unknown error")*/;
            }
            return result!.Results;
        }

        private async Task<T?> PostDataAsync<T>(string url, HttpContent content)
        {
            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
            var jsonString =  await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<FmdcResult<T>>(jsonString);
            if (result == null || result.Error)
            {
                //throw new FmdcException(result?.Message ?? "Unknown error");
            }
            return result!.Results;
        }


    }
    public class FmdcResult<T>
    {
        public bool Error { get; set; }
        public string Message { get; set; } = "";
        public int Code { get; set; }
        public T? Results { get; set; }
    }

}
