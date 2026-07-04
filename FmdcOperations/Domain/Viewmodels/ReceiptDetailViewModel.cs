

namespace Domain.Viewmodels
{
    public class ReceiptDetailViewModel
    {

        public int Id { get; set; }
        public int ReceiptId { get; set; }
        public int? ProcedureId { get; set; }
        public string? Detail { get; set; }
        public double Cost { get; set; }
        public DetailType Type { get; set; }
        public int? TestId { get; set; }
    }
}
