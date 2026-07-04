using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Features.Prescriptions.Commands.Create;
using FMDC.BussinessLayer.Features.Prescriptions.Commands.Delete;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.Enums;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.GetOne;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.List;
using FMDC.BussinessLayer.Features.Prescriptions.Queries.Tests;
using MediatR;
using System.Globalization;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IPrescriptionService
    {
        Task<PrescriptionViewModel?> GetPrescription(int id);
        Task<PagedResults<PrescriptionViewModel>> GetPrescriptions(DataFilter filter);
        Task<PagedResults<PrescriptionViewModel>> GetPatientPrescriptions(DataFilter filter);
        Task<bool> Create(AddPrescriptionViewModel viewmodel);
        Task<bool> Delete(int id);
        Task<SlipViewModel> GeneratePrescription(int id);
    }
}
