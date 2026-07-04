using Microsoft.AspNetCore.Mvc;

namespace Domain.Models
{
    public class Result 
    {
       
        public Result(bool success = false, string message = "")
        {
            Success = success;
            Message = message;
        }

        public bool Success{ get; set;}
        public string Message{ get; set;}


    }
}
