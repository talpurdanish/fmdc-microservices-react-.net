using Domain.Models;
using FMDC.BussinessLayer.Features.Receipts.Queries.Enums;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Queries.ReceiptAppointments
{
    public record GetReceiptAppointmentQuery(int Id, ReceiptAppointmentType Type) : IRequest<Appointment>;
}
