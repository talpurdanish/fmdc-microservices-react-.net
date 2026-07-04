using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace FMDC.BussinessLayer.Clients
{
    public class AsyncRpcClient
    {
        private IConnection? _connection;
        private IChannel? _channel;
        private string? _replyQueue;

        public AsyncRpcClient()
        {

        }

        public async Task StartAsync()
        {

            var factory = new ConnectionFactory { HostName = "localhost" };
            _connection = await factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();
            _replyQueue = (await _channel.QueueDeclareAsync(queue: "", exclusive: true)).QueueName;

            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var correlationId = ea.BasicProperties.CorrelationId;
                var response = Encoding.UTF8.GetString(ea.Body.ToArray());
            };

            await _channel.BasicConsumeAsync(_replyQueue, autoAck: true, consumer: consumer);
        }

        public async void SendRequest(string message)
        {
            if (_channel == null || _replyQueue == null || _connection == null)
            {
                await StartAsync();
            }
            var correlationId = Guid.NewGuid().ToString();
            var props = new BasicProperties
            {
                CorrelationId = correlationId,
                ReplyTo = _replyQueue
            };

            var body = Encoding.UTF8.GetBytes(message);
            if (_channel != null)
            {
                await _channel.BasicPublishAsync(
                    exchange: string.Empty,
                    routingKey: "rpc_queue",
                    mandatory: true,
                    basicProperties: props,
                    body: body,
                    cancellationToken: CancellationToken.None);
            }

        }
    }
}
