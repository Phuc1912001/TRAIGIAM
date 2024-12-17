using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class newvisitmodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FamilyAddress",
                table: "VisitModels",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilyName",
                table: "VisitModels",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilyPhone",
                table: "VisitModels",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FamilyAddress",
                table: "VisitModels");

            migrationBuilder.DropColumn(
                name: "FamilyName",
                table: "VisitModels");

            migrationBuilder.DropColumn(
                name: "FamilyPhone",
                table: "VisitModels");
        }
    }
}
