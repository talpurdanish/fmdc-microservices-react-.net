namespace Domain.Helpers
{
    public class NameIdPair
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public NameIdPair(int id, string name)
        {

            Id = id;
            Name = name;
        }

    }
}
