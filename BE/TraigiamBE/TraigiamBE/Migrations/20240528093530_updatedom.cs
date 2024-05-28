using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class updatedom : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "DomGenderId",
                table: "RoomModels",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "DomGenderId",
                table: "DomModels",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "DomGenderId",
                table: "BedModels",
                type: "bigint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DomGenderId",
                table: "RoomModels");

            migrationBuilder.DropColumn(
                name: "DomGenderId",
                table: "DomModels");

            migrationBuilder.DropColumn(
                name: "DomGenderId",
                table: "BedModels");
        }
    }
}
