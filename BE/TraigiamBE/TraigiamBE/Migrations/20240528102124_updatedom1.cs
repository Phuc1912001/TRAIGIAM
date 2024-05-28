using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class updatedom1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "DomGenderId",
                table: "Prisoner",
                type: "bigint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DomGenderId",
                table: "Prisoner");
        }
    }
}
