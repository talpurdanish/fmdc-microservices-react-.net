using System.Runtime.Serialization;

namespace Domain.Helpers
{
    public class FmdcException : Exception
    {
        public override string Message { get; } = string.Empty;



        public FmdcException()
        {
        }

        public FmdcException(string? message) : base(message)
        {
            Message = message!;
        }

        public FmdcException(string? message, Exception? innerException) : base(message, innerException)
        {
            Message = message!;

        }


    }
}
