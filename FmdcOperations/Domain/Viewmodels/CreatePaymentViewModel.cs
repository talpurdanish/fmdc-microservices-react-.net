namespace Domain.Viewmodels
{
    public class CreatePaymentViewModel
    {
        public long Amount { get; set; }
        public string Currency { get; set; } = "pkr";
        public int ReceiptId { get; set; }

    }
}
