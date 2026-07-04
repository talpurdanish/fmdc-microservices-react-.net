using Domain.Helpers;
using Domain.Models;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.Enums;
using MediatR;

namespace FMDC.BussinessLayer.Features.Prescriptions.Queries.List
{
    public record ListPrescriptionQuery(DataFilter Filter, PrescriptionListType Type = PrescriptionListType.All) : IRequest<PagedResults<Prescription>>;
}
