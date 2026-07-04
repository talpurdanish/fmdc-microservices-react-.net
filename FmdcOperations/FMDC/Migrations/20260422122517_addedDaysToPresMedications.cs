using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FMDC.Migrations
{
    /// <inheritdoc />
    public partial class addedDaysToPresMedications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Days",
                table: "PrescriptionMedications",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Days",
                table: "PrescriptionMedications");
        }
    }
}
