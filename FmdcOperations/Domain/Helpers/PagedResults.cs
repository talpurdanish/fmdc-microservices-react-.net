namespace Domain.Helpers
{
    public class PagedResults<T> where T : class
    {
        public IEnumerable<T> Data { get; set; } = [];
        public int CurrentPage { get; set; } = 1;
        public int TotalRecords { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int? NextPage { get; set; }
        public int? PrevPage { get; set; }

        public PagedResults(IEnumerable<T> data, int currentPage, int totalRecords, int pageSize)
        {
            Data = data;
            CurrentPage = currentPage;
            TotalRecords = totalRecords;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            NextPage = CurrentPage < TotalPages ? CurrentPage + 1 : (int?)null;
            PrevPage = CurrentPage > 1 ? CurrentPage - 1 : (int?)null;
        }
    }

}
