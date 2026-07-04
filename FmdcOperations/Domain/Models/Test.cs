using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Test
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } ="";
        public string Description { get; set; } ="";

        public double Cost { get; set; }

        public List<TestParameter> TestParameters { get; set; } = [];
        
    }
}
