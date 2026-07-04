using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FMDC.BussinessLayer.Kafka
{
    public class MessageHandler(IUnitOfWork unitOfWork)
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<JsonResult> Handle(string type, object payload)
        {
            try
            {
                if (type is null || string.IsNullOrEmpty(type))
                    return FmdcResult.Error("Type is not valid", 404);

                if (payload is null)
                    return FmdcResult.Error("Payload is not valid", 404);


                switch (type)
                {
                    case "GetUser":
                        var number = GetId(payload);
                        var user = await _unitOfWork.Users.GetUserWithCityAndProvinceAsync(number);
                        if (user is null) return FmdcResult.Error("User cannot be found", 404);
                        return FmdcResult.Success(new
                        {
                            user.Id,
                            user.Name,
                            user.PMDCNo
                        });
                    case "GetPatient":
                        number = GetId(payload);
                        var patient = await _unitOfWork.Patients.GetPatientWithCityAndProvinceAsync(number);
                        if (patient is null) return FmdcResult.Error("Patient cannot be found", 404);
                        return FmdcResult.Success(patient);
                    case "GetCity":
                        number = GetId(payload);
                        var city = await _unitOfWork.Cities.GetCityWithProvinceAsync(number);
                        if (city is null) return FmdcResult.Error("City cannot be found", 404);
                        return FmdcResult.Success(new NameIdPair
                        {
                            Id = city.Id,
                            Name = city.Name
                        });
                    case "GetUsers":
                        var ids = GetIdList(payload);
                        var users = await _unitOfWork.Users.GetUsersAsync(ids);
                        if (users is null) return FmdcResult.Error("Users cannot be found", 404);
                        var listUsers = users.Select(u=> new
                        {
                            u.Id,
                            u.Name,
                            u.PMDCNo
                        });
                        return FmdcResult.Success(listUsers);
                    case "GetPatients":
                        ids = GetIdList(payload);
                        var patients = await _unitOfWork.Patients.GetPatientsAsync(ids);
                        if (patients is null) return FmdcResult.Error("Patients cannot be found", 404);
                        return FmdcResult.Success(patients);
                    case "GetCities":
                        ids = GetIdList(payload);
                        var cities = await _unitOfWork.Cities.GetCitiesAsync(ids);
                        if (cities is null) return FmdcResult.Error("Cities cannot be found", 404);
                        var listCities = cities.Select(c => new
                        {
                            c.Id,
                            c.Name
                        });
                        return FmdcResult.Success(listCities);
                    case "SaveNotification":
                        var notification = GetNotification(payload);
                        var result =  _unitOfWork.Notifications.CreateNotification(notification);
                        return FmdcResult.Success(result);
                    default:
                        return FmdcResult.Error("Unknown Type", 404);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 404);
            }
            catch (Exception e)
            {
                return FmdcResult.Error(e.Message, 404);
            }
        }


        public int GetId(object payload)
        {
            
            var isValid = payload is int;
            int id = (int)payload;
            if (!isValid || id <= 0)
                throw new FmdcException("Id is not valid");
            return id;
        }

        public List<int> GetIdList(object payload) {
            var isValid = payload is List<int>;
            List<int> ids = (List<int>)payload;
            if (!isValid || ids.Count ==  0)
                throw new FmdcException("Ids are not valid");
            return ids;
        }

        public Notification GetNotification(object payload)
        {
            var isValid = payload is Notification;
            Notification notification = (Notification)payload;
            if (!isValid)
                throw new FmdcException("Ids are not valid");
            return notification;
        }
    }
}
