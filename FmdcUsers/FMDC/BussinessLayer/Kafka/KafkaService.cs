using Confluent.Kafka;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FMDC.BussinessLayer.Kafka
{
    public record Request
    {
        public string Type { get; init; }
        public Guid RequestGuid { get; init; }
        public object Payload { get; init; }

        public Request(string type, Guid requestGuid, object payload)
        {
            Type = type;
            RequestGuid = requestGuid;
            Payload = payload;

        }
    }

    public class KafkaService : BackgroundService
    {
        private const string RequestTopic = "user-lookup-requests";
        private const string ResponseTopic = "user-lookup-responses";

        private static readonly string[] Brokers =
            { "localhost:19092","localhost:19093","localhost:19094" }; // external ports

        private readonly IServiceScopeFactory _scopeFactory;
        private IConsumer<string, string>? _consumer;
        private IProducer<string, string>? _producer;

        public KafkaService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = string.Join(",", Brokers),
                GroupId = "users-service",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                SessionTimeoutMs = 10000,
                EnableAutoCommit = true,
                FetchMinBytes = 1024 * 1024,
                EnableAutoOffsetStore = false,
                MaxPollIntervalMs = 10000
            };

            _consumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
            _consumer.Subscribe(RequestTopic);

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

            _producer = new ProducerBuilder<string, string>(producerConfig).Build();

                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        // Wait up to 3 seconds for a request
                        var cr = _consumer.Consume(TimeSpan.FromSeconds(3));
                        if (cr == null || cr.Message == null)
                        {
                            // No request received within 3s → skip
                            continue;
                        }

                        var request = JsonConvert.DeserializeObject<Request>(cr.Message.Value);
                        if (request != null)
                        {
                            using var scope = _scopeFactory.CreateScope();
                            var handler = scope.ServiceProvider.GetRequiredService<MessageHandler>();

                            // Wait up to 3 seconds for handler reply
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
                            JsonResult? response = await handler.Handle(request.Type, request.Payload)
                                                                .WaitAsync(cts.Token)
                                                                .ConfigureAwait(false);

                            if (response != null)
                            {
                                var json = JsonConvert.SerializeObject(response);
                                
                                _producer!.Produce(ResponseTopic,
                                    new Message<string, string> { Key = request.RequestGuid.ToString(), Value = json });
                            }
                            else
                            {
                                // Reply not ready in 3s → skip
                            }
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        // graceful shutdown
                    }
                    catch (Exception ex)
                    {
                        // log and continue
                        Console.WriteLine($"KafkaService error: {ex.Message}");
                    }
                }
        }

        public override void Dispose()
        {
            _consumer?.Close();
            _consumer?.Dispose();
            _producer?.Dispose();
            GC.SuppressFinalize(this);
            base.Dispose();
        }
    }
}