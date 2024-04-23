using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class update1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MPN",
                table: "Prisoner",
                newName: "Mpn");

            migrationBuilder.RenameColumn(
                name: "CCCD",
                table: "Prisoner",
                newName: "Cccd");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Mpn",
                table: "Prisoner",
                newName: "MPN");

            migrationBuilder.RenameColumn(
                name: "Cccd",
                table: "Prisoner",
                newName: "CCCD");
        }
    }
}
