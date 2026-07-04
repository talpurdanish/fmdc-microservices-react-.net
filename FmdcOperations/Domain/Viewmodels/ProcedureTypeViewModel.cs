using Domain.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class ProcedureTypeViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Procedure Type Name is Required")]
        [DisplayName("Procedure Type")]
        [StringLength(500, ErrorMessage = "Procedure Type Name should be less than 500 chars")]
        public string Name { get; set; } = "";



    }
}
