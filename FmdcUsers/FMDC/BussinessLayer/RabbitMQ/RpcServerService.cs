using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace FMDC.BussinessLayer.RabbitMQ
{

    public class RpcServerService : BackgroundService
    {
        private readonly ConnectionFactory _connectionFactory;
        private readonly IServiceScopeFactory _scopeFactory;
      
        public RpcServerService(IServiceScopeFactory scopeFactory)
        {
            _connectionFactory = new ConnectionFactory { HostName = "localhost" };
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            const string QUEUE_NAME = "rpc_queue";

            using var connection = await _connectionFactory.CreateConnectionAsync(stoppingToken);
            using var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);

            await channel.QueueDeclareAsync(queue: QUEUE_NAME, durable: true, exclusive: false, cancellationToken: stoppingToken,
                autoDelete: false, arguments: new Dictionary<string, object?> { { "x-queue-type", "quorum" } });

            await channel.BasicQosAsync(prefetchSize: 0, prefetchCount: 1, global: false, cancellationToken: stoppingToken);

            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.ReceivedAsync += async (sender, ea) =>
            {
                AsyncEventingBasicConsumer cons = (AsyncEventingBasicConsumer)sender;
                IChannel ch = cons.Channel;
                string response = string.Empty;

                byte[] body = ea.Body.ToArray();
                IReadOnlyBasicProperties props = ea.BasicProperties;
                var replyProps = new BasicProperties
                {
                    CorrelationId = props.CorrelationId
                };

                var message = Encoding.UTF8.GetString(body);
                using var scope = _scopeFactory.CreateScope();
                var handler = scope.ServiceProvider.GetRequiredService<RpcMessageHandler>();
                response = JsonConvert.SerializeObject(await handler.Handle(message));

                var responseBytes = Encoding.UTF8.GetBytes(response);
                await ch.BasicPublishAsync(exchange: string.Empty, routingKey: props.ReplyTo!,
                    mandatory: true, basicProperties: replyProps, body: responseBytes);
                await ch.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
            };

            await channel.BasicConsumeAsync("rpc_queue", autoAck: false, consumer: consumer, cancellationToken: stoppingToken);
            await Task.Delay(Timeout.Infinite, stoppingToken); // keep alive
        }

       
    }
}