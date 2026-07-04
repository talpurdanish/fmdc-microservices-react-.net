
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


namespace FMDC.Context
{
    public class FmdcOperationsContext : DbContext
    {

        public FmdcOperationsContext(DbContextOptions options) : base(options)

        {

        }

        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionMedication> PrescriptionMedications { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<MedicationType> MedicationTypes { get; set; }
        public DbSet<Procedure> Procedures { get; set; }
        public DbSet<ProcedureType> ProcedureTypes { get; set; }
        public DbSet<Receipt> Receipts { get; set; }
        public DbSet<ReceiptDetails> ReceiptDetails { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<TestParameter> TestParameters { get; set; }
        public DbSet<LabReport> LabReports { get; set; }
        public DbSet<ReportValue> ReportValues { get; set; }
        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<DateOnly>()
                .HaveConversion<DateOnlyConverter, DateOnlyComparer>()
                .HaveColumnType("date");

            configurationBuilder.Properties<DateOnly?>()
                .HaveConversion<NullableDateOnlyConverter, NullableDateOnlyComparer>()
                .HaveColumnType("date");


        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
           

            modelBuilder.Entity<Medication>(etb =>
            {
                etb.HasKey(e => e.Code);
                etb.Property(e => e.Code).ValueGeneratedOnAdd();
                etb.Property(e => e.Name).IsRequired().HasMaxLength(256);
                etb.Property(e => e.Brand).HasMaxLength(256);
                etb.Property(e => e.Description).HasMaxLength(2048);
                etb.ToTable("Medications");
            });

            modelBuilder.Entity<Prescription>(etb =>
            {
                etb.HasKey(e => e.Id);
                etb.Property(e => e.Id).ValueGeneratedOnAdd();

                etb.ToTable("Prescriptions");
            });

            modelBuilder.Entity<Appointment>(etb =>
            {
                etb.HasKey(e => e.Id);
                etb.Property(e => e.Id).ValueGeneratedOnAdd();

                etb.ToTable("Appointments");
            });

            modelBuilder.Entity<Receipt>(etb =>
            {
                etb.HasKey(e => e.Id);
                etb.Property(e => e.Id).ValueGeneratedOnAdd();
                etb.Property(b => b.Date)
                    .HasDefaultValueSql("getdate()");
                etb.ToTable("Receipts");
            });

            modelBuilder.Entity<ReceiptDetails>(etb =>
            {
                etb.HasKey(e => e.Id);
                etb.ToTable("ReceiptDetails");
            });

        }

    }

    public class DateOnlyConverter : ValueConverter<DateOnly, DateTime>
    {
        /// <summary>
        /// Creates a new instance of this converter.
        /// </summary>
        public DateOnlyConverter() : base(
                d => d.ToDateTime(TimeOnly.MinValue),
                d => DateOnly.FromDateTime(d))
        { }
    }

    /// <summary>
    /// Compares <see cref="DateOnly" />.
    /// </summary>
    public class DateOnlyComparer : ValueComparer<DateOnly>
    {
        /// <summary>
        /// Creates a new instance of this converter.
        /// </summary>
        public DateOnlyComparer() : base(
            (d1, d2) => d1 == d2 && d1.DayNumber == d2.DayNumber,
            d => d.GetHashCode())
        {
        }
    }

    /// <summary>
    /// Converts <see cref="DateOnly?" /> to <see cref="DateTime?"/> and vice versa.
    /// </summary>
    public class NullableDateOnlyConverter : ValueConverter<DateOnly?, DateTime?>
    {
        /// <summary>
        /// Creates a new instance of this converter.
        /// </summary>
        public NullableDateOnlyConverter() : base(
            d => d == null
                ? null
                : new DateTime?(d.Value.ToDateTime(TimeOnly.MinValue)),
            d => d == null
                ? null
                : new DateOnly?(DateOnly.FromDateTime(d.Value)))
        { }
    }

    /// <summary>
    /// Compares <see cref="DateOnly?" />.
    /// </summary>
    public class NullableDateOnlyComparer : ValueComparer<DateOnly?>
    {
        /// <summary>
        /// Creates a new instance of this converter.
        /// </summary>
        public NullableDateOnlyComparer() : base(
            (d1, d2) => d1 == d2 && d1.GetValueOrDefault().DayNumber == d2.GetValueOrDefault().DayNumber,
            d => d.GetHashCode())
        {
        }
    }

}
