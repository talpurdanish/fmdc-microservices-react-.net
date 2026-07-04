using Domain.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class TestParameterViewModel
    {

        public int Id { get; set; }
        [Required]
        public string? Name { get; set; } ="";
        [Required]
        [DisplayName("Maximum Value (Male)")]
        public double MaleMaxValue { get; set; }
        [Required]
        [DisplayName("Minimum Value (Male)")]
        public double MaleMinValue { get; set; }
        
        [DisplayName("Maximum Value (Female)")]
        public double FemaleMaxValue { get; set; }
        
        [DisplayName("Minimum Value (Female)")]
        public double FemaleMinValue { get; set; }

        [Required]
        public string? Unit { get; set; } ="";
        public double Value { get; set; }

        public int TestId { get; set; }
        public string? TestName { get; set; } = "";
        [DisplayName("Reference Range")]
        public string? ReferenceRange { get; set; } ="";
        public bool Gender { get; set; }

        public bool Status { get; set; }


    }
}