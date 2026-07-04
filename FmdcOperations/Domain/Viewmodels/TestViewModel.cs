using Domain.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class TestViewModel
    {

        public int Id { get; set; }
        [Required]
        [DisplayName("Test Name")]
        [StringLength(500, ErrorMessage = "Test Name cannot be longer than 500 chars")]
        public string Name { get; set; } = "";
        [StringLength(1500, ErrorMessage = "Test Name cannot be longer than 1500 chars")]
        public string Description { get; set; } = "";
        public double Cost { get; set; }

        [DisplayName("Parameters")]
        public IEnumerable<TestParameterViewModel> TestParameters { get; set; } = new List<TestParameterViewModel>();

    }
}
