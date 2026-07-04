using Domain.Viewmodels;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Stripe.Apps;
using System.Collections.Concurrent;
using System.Text;

namespace FMDC.BussinessLayer.Clients
{


    public interface IRpcClientService
    {
        Task<UserViewModel?> GetUserAsync(int id);
        Task<PatientViewModel?> GetPatientAsync(int id);
        Task<CityViewModel?> GetCityAsync(int id);

    }
    public class RpcClientService : IRpcClientService
    {

        private const string QUEUE_NAME = "rpc_queue";

        private readonly ConnectionFactory _connectionFactory = new() { HostName = "localhost" };
        private readonly ConcurrentDictionary<string, TaskCompletionSource<string>> _callbackMapper
            = new();

        private IConnection? _connection;
        private IChannel? _channel;
        private string? _replyQueueName;
        private async Task StartAsync()
        {
            _connection = await _connectionFactory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            // declare a server-named queue
            QueueDeclareOk queueDeclareResult = await _channel.QueueDeclareAsync();
            _replyQueueName = queueDeclareResult.QueueName;
            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += (model, ea) =>
            {
                string? correlationId = ea.BasicProperties.CorrelationId;

                if (false == string.IsNullOrEmpty(correlationId))
                {
                    if (_callbackMapper.TryRemove(correlationId, out var tcs))
                    {
                        var body = ea.Body.ToArray();
                        var response = Encoding.UTF8.GetString(body);
                        tcs.TrySetResult(response);
                    }
                }

                return Task.CompletedTask;
            };

            await _channel.BasicConsumeAsync(_replyQueueName, true, consumer);
        }

        private async Task<string> CallAsync(string message,
            CancellationToken cancellationToken = default)
        {
            if (_channel is null)
            {
                throw new InvalidOperationException();
            }

            string correlationId = Guid.NewGuid().ToString();
            var props = new BasicProperties
            {
                CorrelationId = correlationId,
                ReplyTo = _replyQueueName
            };

            var tcs = new TaskCompletionSource<string>(
                    TaskCreationOptions.RunContinuationsAsynchronously);
            _callbackMapper.TryAdd(correlationId, tcs);

            var messageBytes = Encoding.UTF8.GetBytes(message);
            await _channel.BasicPublishAsync(exchange: string.Empty, routingKey: QUEUE_NAME, mandatory: true, basicProperties: props, body: messageBytes, cancellationToken: cancellationToken);

            using CancellationTokenRegistration ctr =
                cancellationToken.Register(() =>
                {
                    _callbackMapper.TryRemove(correlationId, out _);
                    tcs.SetCanceled();
                });

            return await tcs.Task;
        }

        private async ValueTask DisposeAsync()
        {
            if (_channel is not null)
            {
                await _channel.CloseAsync();
            }

            if (_connection is not null)
            {
                await _connection.CloseAsync();
            }
        }
        private async Task<T?> InvokeAsync<T>(string n)
        {
            await StartAsync();
            var response = await CallAsync(n);
            try
            {
                var rpcResult = JsonConvert.DeserializeObject<RpcResult<T>>(response);
                if (rpcResult == null)
                {
                    return default(T?);
                }

                if (rpcResult.Value == null)
                {
                    return default(T?);
                }
                var result = rpcResult.Value;
                if (result == null || result.Error)
                {
                    return default(T?);
                }
                return result!.Results;
            }
            catch (Exception e)
            {

                throw e;
            }
        }

        public async Task<UserViewModel?> GetUserAsync(int id)
        {
            string message = $"GetUser:{id}";
            return await InvokeAsync<UserViewModel>(message);
        }

        public async Task<PatientViewModel?> GetPatientAsync(int id)
        {
            string message = $"GetPatient:{id}";
            return await InvokeAsync<PatientViewModel>(message);
        }

        public async Task<CityViewModel?> GetCityAsync(int id)
        {
            string message = $"GetCity:{id}";
            return await InvokeAsync<CityViewModel>(message);
        }
    }

    public class RpcResult<T> 
    {
        public string? ContentType { get; set; }
        public string? SerliazerSettings { get; set; }
        public string? StatusCode { get; set; }
        public FmdcResult<T?>? Value { get; set; }
    }

}

