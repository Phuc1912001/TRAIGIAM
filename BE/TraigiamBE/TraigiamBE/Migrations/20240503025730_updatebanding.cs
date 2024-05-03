using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class updatebanding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Banding",
                table: "Prisoner");

            migrationBuilder.AddColumn<long>(
                name: "BandingID",
                table: "Prisoner",
                type: "bigint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BandingID",
                table: "Prisoner");

            migrationBuilder.AddColumn<int>(
                name: "Banding",
                table: "Prisoner",
                type: "int",
                nullable: true);
        }
    }
}
