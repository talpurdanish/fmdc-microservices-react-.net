using Domain.Helpers;
using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace FMDC.BussinessLayer.Features.Prescriptions.Commands.Create
{
    public class CreatePrescriptionCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreatePrescriptionCommand, bool>
    {
        public async Task<bool> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
        {
            using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                await context.Prescriptions.AddAsync(request.Model, cancellationToken);
                var presAdded = await context.SaveChangesAsync(cancellationToken);
                if (presAdded <= 0)
                {
                    throw new FmdcException("Prescription could not be created");
                }

                var presMedList = GenerateMedicationList(request.Medications, request.Model.Id);
                await context.PrescriptionMedications.AddRangeAsync(presMedList, cancellationToken);
                var appointment = await context.Appointments.FirstOrDefaultAsync(a => a.Id == request.Model.AppointmentId, cancellationToken) ?? throw new FmdcException("Appointment could not be found");
                var currentDate = DateTime.Now;
                appointment.EndDate = currentDate;
                appointment.EndTime = TimeOnly.FromDateTime(currentDate);

                context.Appointments.Update(appointment);

                if (appointment != null)
                {
                    var labTestsList = await GenerateLabTestsList(request.Tests, appointment.PatientId, appointment.UserId, request.Model.Id);
                    await context.LabReports.AddRangeAsync(labTestsList, cancellationToken);
                }
                var presSaved = await context.SaveChangesAsync(cancellationToken);
                
                // Commit if everything succeeded
                await transaction.CommitAsync(cancellationToken);
                return presAdded >0;

            }
            catch (Exception)
            {
                await transaction.RollbackAsync(cancellationToken);
                return false; 
            }
        }
        private static List<PrescriptionMedication> GenerateMedicationList(List<string> medicines, int pId)
        {
            List<PrescriptionMedication> medicationList = [];
            foreach (string medicine in medicines)
            {
                if (!string.IsNullOrEmpty(medicine))
                {
                    string[] aStr = medicine.Split(',');
                    foreach (var str in aStr)
                    {
                        var strArray = str.Split(':');
                        if (strArray.Length == 4)
                        {
                            medicationList.Add(new PrescriptionMedication()
                            {
                                MedicationCode = int.Parse(strArray[0], CultureInfo.InvariantCulture),
                                Quantity = double.Parse(strArray[1], CultureInfo.InvariantCulture),
                                Units = strArray[2],
                                Times = int.Parse(strArray[3], CultureInfo.InvariantCulture),
                                Days = int.Parse(strArray[4], CultureInfo.InvariantCulture),
                                PrescriptionId = pId
                            });
                        }
                    }
                }
            }



            return medicationList;
        }

        private async Task<List<LabReport>> GenerateLabTestsList(List<int> testIds, int patientId, int doctorId, int prescriptionId)
        {
            var testList = new List<LabReport>();
            if (testIds.Count > 0)
            {
                var now = DateTime.Now;
                var delivery = now.AddDays(7);
                var maxReportNumber = await context.LabReports.MaxAsync(l => l.ReportNumber);

                foreach (var id in testIds)
                {
                    var report = new LabReport()
                    {
                        TestId = id,
                        ReportDate = DateOnly.FromDateTime(now),
                        ReportTime = TimeOnly.FromDateTime(now),
                        ReportDeliveryDate = DateOnly.FromDateTime(delivery),
                        ReportDeliveryTime = TimeOnly.FromDateTime(delivery),
                        PatientId = patientId,
                        DoctorId = doctorId,
                        Note = "Lab report has been created as prescribed by Doctor via Prescription Form",
                        ReportNumber = maxReportNumber++,
                        PrescriptionId = prescriptionId

                    };
                    testList.Add(report);
                }

            }
            return testList;
        }
        //private static int[] StringToArray(string arrayString)
        //{
        //    int[] rInt;

        //    arrayString = arrayString.Replace('[', ' ').Replace(']', ' ');
        //    if (!string.IsNullOrEmpty(arrayString))
        //    {
        //        if (int.TryParse(arrayString, out int onlyInt))
        //        {
        //            rInt = [onlyInt];
        //        }
        //        else
        //        {

        //            string[] aStr = arrayString.Split(',');
        //            rInt = new int[aStr.Length];
        //            int i = 0;
        //            foreach (var str in aStr)
        //            {
        //                rInt[i] = int.Parse(str, CultureInfo.InvariantCulture);
        //                i++;
        //            }
        //        }
        //    }
        //    else
        //        rInt = [];
        //    return rInt;
        //}
    }
}
