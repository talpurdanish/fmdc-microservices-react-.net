namespace Domain.Helpers
{
    public class DataFilter
    {
        public string? Term { get; set; } = "";
        public int SearchField { get; set; } = 1;
        public string SortField { get; set; } = "Id";
        public int Order { get; set; } = 1;
        public int Id { get; set; } = -1;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 5;
        public bool PageLess { get; set; }
    }
}
