using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Interfaces;
using Domain.Repositories;

namespace FMDC.BussinessLayer.Services
{
    public class PatientService(IUnitOfWork unitOfWork, IMapper mapper) : IPatientService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;

        public async Task<PatientViewModel?> GetPatient(int id)
        {
            try
            {
                if (id <= 0)
                    throw new FmdcException("Id cannot be null");

                var patient = await _unitOfWork.Patients.GetPatientWithCityAndProvinceAsync(id) ?? throw new FmdcException("Patient does not exists");
                return _mapper.Map<PatientViewModel>(patient);
            }
            catch (Exception)
            {

                return null;
            }
        }

        public async Task<PagedResults<PatientViewModel>> GetPatients(DataFilter filter)
        {
            var records = await _unitOfWork.Patients.GetPatientsWithCityAndProvinceAsync(filter);
            var data = _mapper.Map<IEnumerable<PatientViewModel>>(records.Data);
            
            return new PagedResults<PatientViewModel>(data, records.CurrentPage, records.TotalRecords, records.PageSize);
        }

        public async Task<bool> Create(PatientViewModel viewmodel)
        {
            await CheckCnic(viewmodel.CNIC);

            var model = _mapper.Map<Patient>(viewmodel);

            model.PatientNumber = await ComputePatientNumber();
            model.Picture = FormatPicture(viewmodel.Picture);

            await _unitOfWork.Patients.AddAsync(model);
            var rowsChanged = await _unitOfWork.SaveChangesAsync();
            return rowsChanged > 0;
        }

        private static byte[]? FormatPicture(string? picture)
        {

            if (!string.IsNullOrEmpty(picture))
            {
                try
                {
                    // Remove data URI prefix if present
                    var base64Data = picture;
                    if (base64Data.Contains(','))
                    {
                        base64Data = base64Data[(base64Data.IndexOf(',', StringComparison.InvariantCulture) + 1)..];
                    }

                    return Convert.FromBase64String(base64Data);
                }
                catch (Exception ex)
                {
                    throw new FmdcException("Invalid image data: " + ex.Message);
                }
            }
            return null;

        }
        private async Task<string> ComputePatientNumber()
        {
            var maxMrNoQuery = await _unitOfWork.Patients.GetMaxMRId();
            var previousId = maxMrNoQuery != null ? maxMrNoQuery : 1;

            return DateTime.Now.ToString("MM", System.Globalization.CultureInfo.InvariantCulture)
                + "\\" + DateTime.Now.ToString("yyyy", System.Globalization.CultureInfo.InvariantCulture)
                + "-100" + (previousId + 1);
        }

        private async Task CheckCnic(string value, int id = -1)
        {
            var exists = await _unitOfWork.Patients.AnyAsync(u => u.CNIC == value && (id <= 0 || u.Id != id));
            if (exists)
                throw new FmdcException("CNIC already exists");

        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var patient = await _unitOfWork.Patients.GetByIdAsync(id)?? throw new FmdcException("Patient does not exists");

                _unitOfWork.Patients.Remove(patient);

                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {

                return false;
            }

        }

        public async Task<bool> Update(PatientViewModel viewmodel)
        {
            var patient = await _unitOfWork.Patients.GetByIdAsync(viewmodel.Id)??throw new FmdcException("Patient does not exists");

           await CheckCnic(viewmodel.CNIC, viewmodel.Id);

            patient.Name = viewmodel.Name;
            patient.CNIC = viewmodel.CNIC;
            patient.Address = viewmodel.Address;
            patient.DateofBirth = viewmodel.DateofBirth;
            patient.FatherName = string.IsNullOrEmpty(viewmodel.FatherName) ? "" : viewmodel.FatherName;
            patient.PhoneNo = viewmodel.PhoneNo;
            patient.PhoneType = viewmodel.PhoneType;
            patient.BloodGroup = viewmodel.BloodGroup;
            patient.Gender = viewmodel.Gender;
            patient.CityId = viewmodel.CityId;
            patient.Picture = FormatPicture(viewmodel.Picture);

            _unitOfWork.Patients.Update(patient);

            var rowsChanged = await _unitOfWork.SaveChangesAsync();
            return rowsChanged > 0;
        }

        public async Task<bool> CheckDuplicate(DuplicateType type, string value, int id = -1)
        {
            bool patient = false;

            switch (type)
            {
                case DuplicateType.Pmdcno:
                    patient = id == -1 ? await _unitOfWork.Patients.AnyAsync(u => u.PatientNumber == value) : await _unitOfWork.Patients.AnyAsync(u => u.PatientNumber == value && u.Id != id);
                    break;
                case DuplicateType.Cnic:
                    patient = id == -1 ? await _unitOfWork.Patients.AnyAsync(u => u.CNIC == value) : await _unitOfWork.Patients.AnyAsync(u => u.CNIC == value && u.Id != id);
                    break;

            }

            return patient;

        }

        public async Task<PatientStatViewModel?> GetStat()
        {
            var stats = await _unitOfWork.Patients.GetStatisticsAsync();

            var viewModel = _mapper.Map<PatientStatViewModel>(stats);

            return viewModel;

        }
    }
}
