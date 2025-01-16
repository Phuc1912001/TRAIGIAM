using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class updateTestModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "TestModels");

            migrationBuilder.DropColumn(
                name: "TestId",
                table: "TestModels");

            migrationBuilder.AddColumn<string>(
                name: "Desc",
                table: "TestModels",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TestName",
                table: "TestModels",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Desc",
                table: "TestModels");

            migrationBuilder.DropColumn(
                name: "TestName",
                table: "TestModels");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "TestModels",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "TestId",
                table: "TestModels",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
