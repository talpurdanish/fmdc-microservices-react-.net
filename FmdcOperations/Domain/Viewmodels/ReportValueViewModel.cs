using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Domain.Models;

namespace Domain.Viewmodels
{
    public class ReportValueViewModel
    {
        public int Id { get; set; }
        [Required]
        [DisplayName("Maximum Value")]
        public double Value { get; set; }
        [Required]
        [DisplayName("Parameter ID")]
        public int TestParameterId { get; set; }

        [DisplayName("Parameter")]
        public TestParameterViewModel TestParameter { get; set; } = new TestParameterViewModel();
        public int LabReportId { get; set; }
            
        
    }
}
