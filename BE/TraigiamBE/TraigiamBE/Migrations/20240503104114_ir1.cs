using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class ir1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "InfringementModels",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "InfringementModels",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "InfringementModels",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedByName",
                table: "InfringementModels",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "InfringementModels");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "InfringementModels");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "InfringementModels");

            migrationBuilder.DropColumn(
                name: "ModifiedByName",
                table: "InfringementModels");
        }
    }
}
