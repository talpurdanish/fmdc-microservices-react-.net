using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class TestParameter
    {

        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = "";

        [Required]
        public double MaleMaxValue { get; set; }

        [Required]
        public double MaleMinValue { get; set; }

        public double FemaleMaxValue { get; set; }

        public double FemaleMinValue { get; set; }

        public string Unit { get; set; } = "";

        public int TestId { get; set; }

        public string ReferenceRange { get; set; } = "";

        public bool Gender { get; set; }

        public virtual Test? Test { get; set; }


    }
}