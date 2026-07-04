namespace Domain.Models
{
    public class ReceiptDetails
    {
        public int Id { get; set; }
        public int ReceiptId { get; set; }
        public int? ProcedureId { get; set; }
        public int? TestId { get; set; }
        public virtual Receipt? Receipt { get; set; }
        public virtual Procedure? Procedure { get; set; }
        public virtual Test? Test { get; set; }
    }


    public class  ReceiptProcedure
    {

        public int ReceiptId { get; set; }
        public Procedure? Procedure { get; set; }

    }
    public class ReceiptTest
    {
        public int ReceiptId { get; set; }
        public Test? Test { get; set; } 

    }


}
