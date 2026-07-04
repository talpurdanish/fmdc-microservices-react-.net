using Domain.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class ProcedureViewModel
    {

        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "ProcedureName is Required")]
        [DisplayName("Procedure Name")]
        [StringLength(250, ErrorMessage = "ProcedureName should be less than 250 chars")]
        public string Name { get; set; } = "";

        [Required(ErrorMessage = "Procedure Cost is Required")]
        [DataType("double")]
        [DisplayName("Procedure Cost")]
        public double Cost { get; set; }

        public string  Type { get; set; } = "";
        public  int TypeID { get; set; }
        public  int SNo { get; set; }



    }
}
