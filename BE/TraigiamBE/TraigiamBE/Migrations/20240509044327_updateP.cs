using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class updateP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bed",
                table: "Prisoner");

            migrationBuilder.DropColumn(
                name: "Dom",
                table: "Prisoner");

            migrationBuilder.AddColumn<long>(
                name: "BedId",
                table: "Prisoner",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "DomId",
                table: "Prisoner",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "RoomId",
                table: "Prisoner",
                type: "bigint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BedId",
                table: "Prisoner");

            migrationBuilder.DropColumn(
                name: "DomId",
                table: "Prisoner");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "Prisoner");

            migrationBuilder.AddColumn<int>(
                name: "Bed",
                table: "Prisoner",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Dom",
                table: "Prisoner",
                type: "int",
                nullable: true);
        }
    }
}
