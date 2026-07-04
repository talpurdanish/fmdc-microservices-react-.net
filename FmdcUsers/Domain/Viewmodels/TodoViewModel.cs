using Domain.Models;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class TodoViewModel
    {

        public int Id { get; set; }
        [Required(ErrorMessage = "UserId is Required")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Title is Required")]
        [DisplayName("Title")]
        [StringLength(250, ErrorMessage = "Title should be less than 250 chars")]
        public string Title { get; set; } = "";

        public string Created { get; set; } = "";
        public bool Completed { get; set; }
        public static TodoViewModel GenerateViewModel(TodoEvent model)
        {

            TodoViewModel viewModel = new()
            {
                UserId = model.UserId,
                Title = model.Title,
                Created = model.Created.ToString("dd MMM yyyy HH:mm", System.Globalization.CultureInfo.InvariantCulture),
                Completed = model.Completed
            };
            return viewModel;

        }
        public TodoViewModel() { }

        public static TodoEvent GenerateModel(TodoViewModel viewModel)
        {
            TodoEvent model = new()
            {
                Created = DateTime.Now,
                Completed = false,

                UserId = viewModel.UserId,
                Title = viewModel.Title
            };


            return model;
        }
    }
}
