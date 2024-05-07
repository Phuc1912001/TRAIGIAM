using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TraigiamBE.Migrations
{
    public partial class updateStatement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CreatedBy",
                table: "StatementModels",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "StatementModels",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ModifiedBy",
                table: "StatementModels",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedByName",
                table: "StatementModels",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "StatementModels",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TimeStatement",
                table: "StatementModels",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "StatementModels");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "StatementModels");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "StatementModels");

            migrationBuilder.DropColumn(
                name: "ModifiedByName",
                table: "StatementModels");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "StatementModels");

            migrationBuilder.DropColumn(
                name: "TimeStatement",
                table: "StatementModels");
        }
    }
}
