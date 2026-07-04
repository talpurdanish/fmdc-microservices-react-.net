using System.ComponentModel.DataAnnotations;

namespace FMDC.Helpers
{
    public class OptionalMinLengthAttribute : ValidationAttribute
    {
        private readonly int _minLength;

        public OptionalMinLengthAttribute(int minLength)
        {
            _minLength = minLength;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var str = value as string;

            if (string.IsNullOrEmpty(str))
                return ValidationResult.Success; // allow empty

            if (str.Length < _minLength)
                return new ValidationResult($"Password must be at least {_minLength} characters long.");

            return ValidationResult.Success;
        }
    }
}
