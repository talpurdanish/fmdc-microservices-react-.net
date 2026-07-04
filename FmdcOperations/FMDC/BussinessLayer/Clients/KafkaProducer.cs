using Confluent.Kafka;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using Newtonsoft.Json;

namespace FMDC.BussinessLayer.Clients
{


    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PMDCNo { get; set; } = string.Empty;
    }

    public interface IClientService
    {
        Task<UserDto?> GetUserAsync(int id);
        Task<IEnumerable<UserDto>?> GetUsersAsync(List<int> ids);
        Task<PatientViewModel?> GetPatientAsync(int id);
        Task<IEnumerable<PatientViewModel>?> GetPatientsAsync(List<int> ids);
        Task<NameIdPair?> GetCityAsync(int id);
        Task<IEnumerable<NameIdPair>?> GetCitiesAsync(List<int> ids);
        Task<bool> SaveNotificationAsync(Notification message);
    }

    
    public class ClientService : IClientService
    {
        private const int defaultDelay = 1000;
        private const int retries = 3;
        private const string RequestTopic = "user-lookup-requests";
        private const string ResponseTopic = "user-lookup-responses";
        // Multiple brokers for resilience
        private static readonly string[] Brokers =
            { "localhost:19092","localhost:19093","localhost:19094" };

        private readonly IProducer<string, string> _producer;
        private readonly IConsumer<string, string> _consumer;

        public ClientService()
        {
            var producerConfig = new ProducerConfig
            {
                BootstrapServers = string.Join(",", Brokers),
                EnableDeliveryReports = true,
                Acks = Acks.All,
                EnableIdempotence = true,
                MessageSendMaxRetries = 3,
                LingerMs = 5,
                RetryBackoffMs = 1000
            };
            _producer = new ProducerBuilder<string, string>(producerConfig)
                .SetValueSerializer(Serializers.Utf8)
                .SetLogHandler((_, message) =>
                    Console.WriteLine($"Facility: {message.Facility}-{message.Level} Message: {message.Message}"))
                .SetErrorHandler((_, e) => Console.WriteLine($"Error: {e.Reason}. Is Fatal: {e.IsFatal}"))
                .Build();

            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = string.Join(",", Brokers),
                GroupId = "operations-service",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                SessionTimeoutMs = 10000,
                EnableAutoCommit = true,
                FetchMinBytes = 1024 * 1024,
                EnableAutoOffsetStore = false,
                MaxPollIntervalMs = 10000
            };
            _consumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
            _consumer.Subscribe(ResponseTopic);
        }

        public async Task<UserDto?> GetUserAsync(int id)
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var request = new Request<int>("GetUser", guid, id);
                return await SendAndRecieveWithRetry<UserDto,int>(request);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<PatientViewModel?> GetPatientAsync(int id)
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var request = new Request<int>("GetPatient", guid, id);
                var response = await SendAndRecieveWithRetry<PatientViewModel,int>(request);
                return response;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<NameIdPair?> GetCityAsync(int id)
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var request = new Request<int>("GetCity", guid,id);
                return await SendAndRecieveWithRetry<NameIdPair,int>(request);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> SaveNotificationAsync(Notification message)
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var request = new Request<Notification>("SaveNotification",guid, message);
                return await SendAndRecieveWithRetry<bool,Notification>(request);
            }
            catch (Exception)
            {
                return false;
            }
        }

       

        public async Task<IEnumerable<UserDto>?> GetUsersAsync(List<int> ids)
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var request = new Request<List<int>>("GetUsers", guid, ids);
                return await SendAndRecieveWithRetry<IEnumerable<UserDto>, List<int>>(request);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<IEnumerable<PatientViewModel>?> GetPatientsAsync(List<int> ids)
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var request = new Request<List<int>>("GetPatients", guid, ids);
                return await SendAndRecieveWithRetry<IEnumerable<PatientViewModel>, List<int>>(request);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<IEnumerable<NameIdPair>?> GetCitiesAsync(List<int> ids)
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var request = new Request<List<int>>("GetCities", guid, ids);
                return await SendAndRecieveWithRetry<IEnumerable<NameIdPair>, List<int>>(request);
            }
            catch (Exception)
            {
                return null;
            }
        }

        #region Internal Methods
        private async Task<T?> SendAndRecieveWithRetry<T,P>(Request<P> request)
        {
            int delay = defaultDelay;
            for (var attempts = 1; attempts < retries; attempts++)
            {
                await SendRequestAsync(request);
                var response = await WaitForResponse<T,P>(request);
                if (response != null)
                    return response;

                await Task.Delay(delay);
                delay *= 2;
            }
            return default;
        }

        private async Task SendRequestAsync<P>(Request<P> payload)
        {
            try
            {
                var json = JsonConvert.SerializeObject(payload);
                await _producer.ProduceAsync(RequestTopic,
                    new Message<string, string> { Key = payload.RequestGuid.ToString(), Value = json });
            }
            catch (ProduceException<Guid, string> e)
            {
                throw new FmdcException(e.Message);
            }
            catch (Exception)
            {
                return;
            }
        }

        private async Task<T?> WaitForResponse<T,P>(Request<P> request)
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3)); // 3s timeout

            try
            {
                while (!cts.IsCancellationRequested)
                {
                    try
                    {
                        var cr = _consumer.Consume(cts.Token); // respects cancellation

                        if (cr?.Message?.Key == request.RequestGuid.ToString())
                        {
                            try
                            {
                                var parsedMessage = JsonConvert.DeserializeObject<Message<T>>(cr.Message.Value)
                                    ?? throw new FmdcException("parsedMessage is null");

                                var result = parsedMessage.Value;

                                if (result == null || result.Error)
                                    throw new FmdcException(result?.Message ?? "Unknown error");

                                return result.Results;
                            }
                            catch (Exception e)
                            {
                                throw new FmdcException(e.Message ?? "Unknown error");
                            }
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        return default; 
                    }
                }
            }
            catch (Exception)
            {
                return default; 
            }
            return default;
        }
        #endregion
    }

    public record Request<T>
    {
        public string Type { get; init; }
        public Guid RequestGuid { get; init; }
        public T Payload { get; init; }

        public Request(string type, Guid requestGuid, T payload)
        {
            Type = type;
            RequestGuid = requestGuid;
            Payload = payload;
        }
    }

    public class Message<T>
    {
        public string? ContentType { get; set; }
        public string? SerializerSettings { get; set; }
        public string? StatusCode { get; set; }
        public FmdcResult<T?>? Value { get; set; }
    }

    public class FmdcResult<T>
    {
        public T? Results { get; set; }
        public bool Error { get; set; }
        public string Message { get; set; } = string.Empty;
        public int Code { get; set; } = StatusCodes.Status200OK;

    }

}

