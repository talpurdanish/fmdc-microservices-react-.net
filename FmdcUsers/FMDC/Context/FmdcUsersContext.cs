
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


namespace FMDC.Context
{
    public class FmdcUsersContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<TodoEvent> TodoEvents { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            // Default string length
            configurationBuilder.Properties<string>()
                .HaveMaxLength(250);

            // Enforce UTC DateTime
            configurationBuilder.Properties<DateTime>().HaveConversion<DateTimeToUtcConverter>();

            // Decimal precision (if you add financial fields later)
            configurationBuilder.Properties<decimal>()
                .HavePrecision(18, 2);

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User → City
            modelBuilder.Entity<User>()
                .HasOne(u => u.City)
                .WithMany()
                .HasForeignKey(u => u.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            // Patient → City
            modelBuilder.Entity<Patient>()
                .HasOne(p => p.City)
                .WithMany()
                .HasForeignKey(p => p.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            // City → Province
            modelBuilder.Entity<City>()
                .HasOne(c => c.Province)
                .WithMany(p => p.Cities)
                .HasForeignKey(c => c.ProvinceId)
                .OnDelete(DeleteBehavior.Restrict);

            // TodoEvent → User
            modelBuilder.Entity<TodoEvent>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.CNIC)
                .IsUnique(false);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.PMDCNo)
                .IsUnique(false);

            modelBuilder.Entity<Patient>()
                .HasIndex(p => p.CNIC)
                .IsUnique();
            modelBuilder.Entity<Patient>()
                .HasIndex(p => p.PatientNumber)
                .IsUnique();

            modelBuilder.Entity<Patient>()
                .HasIndex(p => p.MRNoID)
                .IsUnique();
        }

        public class DateTimeToUtcConverter : ValueConverter<DateTime, DateTime>
        {
            public DateTimeToUtcConverter()
                : base(
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc),   // when saving
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc))   // when reading
            { }
        }
    }
}
