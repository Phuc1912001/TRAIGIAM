using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class infringement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InfringementModels",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Mvp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NameIR = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TimeInfringement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Desc = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rivise = table.Column<int>(type: "int", nullable: true),
                    PunishId = table.Column<long>(type: "bigint", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InfringementModels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YouthIRModels",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    YouthID = table.Column<long>(type: "bigint", nullable: true),
                    InfringementID = table.Column<long>(type: "bigint", nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YouthIRModels", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InfringementModels");

            migrationBuilder.DropTable(
                name: "YouthIRModels");
        }
    }
}
