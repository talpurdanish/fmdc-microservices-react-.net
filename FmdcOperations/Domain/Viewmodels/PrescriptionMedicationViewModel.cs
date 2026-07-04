using Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class PrescriptionMedicationViewModel
    {
        //Dose Parameters
        public int PrescriptionId { get; set; }
        [Required]
        public double Quantity { get; set; }
        [Required]
        public string Units { get; set; } = "";
        [Required]
        public int Times { get; set; }

        [Required]
        public int MedicationCode { get; set; }
        public string Medication { get; set; } = "";



        public override string ToString()
        {
            var timeStr = Times == 1 ? "a day" : "times/day";
            if (Quantity == 1)
            {
                Units = Units.Substring(0, Units.Length - 1);
            }

            var str = "{0} ............. {1} {2} {3} {4}";
            return string.Format(System.Globalization.CultureInfo.InvariantCulture,str, Medication, Quantity, Units, Times, timeStr);
        }
    }
}
