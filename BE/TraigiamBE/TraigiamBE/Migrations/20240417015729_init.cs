using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Prisoner",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrisonerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrisonerAge = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CCCD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MPN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Banding = table.Column<int>(type: "int", nullable: true),
                    Dom = table.Column<int>(type: "int", nullable: false),
                    Bed = table.Column<int>(type: "int", nullable: true),
                    Countryside = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Crime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Years = table.Column<int>(type: "int", nullable: true),
                    Manager = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImagePrisoner = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prisoner", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Prisoner");
        }
    }
}
