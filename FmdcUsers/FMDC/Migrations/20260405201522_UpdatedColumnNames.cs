using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FMDC.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedColumnNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "ProvinceId",
                table: "Provinces",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "PatientId",
                table: "Patients",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "CityId",
                table: "Cities",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Provinces",
                newName: "ProvinceId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Patients",
                newName: "PatientId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Cities",
                newName: "CityId");
        }
    }
}
