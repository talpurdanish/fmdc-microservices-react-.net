using Domain.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class MedicationTypeViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Medication Type Name is Required")]
        [DisplayName("Medication Type")]
        [StringLength(500, ErrorMessage = "Medication Type Name should be less than 500 chars")]
        public string Name { get; set; } = "";



    }
}
