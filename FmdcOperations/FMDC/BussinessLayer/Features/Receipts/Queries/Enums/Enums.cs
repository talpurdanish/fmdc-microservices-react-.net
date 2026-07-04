namespace FMDC.BussinessLayer.Features.Receipts.Queries.Enums
{
    public enum ReceiptListType
    {
        All, Patient, Unpaid
    }

    public enum ReceiptStatsType
    {
        Doctor, All
    }

    public enum ReceiptAppointmentType { 
    
        ByReceiptId, ByPatientId
    
    }
}
