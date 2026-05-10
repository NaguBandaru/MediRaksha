using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediRaksha.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMfgDetailsToBatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ManufacturingDate",
                table: "InventoryBatches",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "MfgLicenseNumber",
                table: "InventoryBatches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ManufacturingDate",
                table: "InventoryBatches");

            migrationBuilder.DropColumn(
                name: "MfgLicenseNumber",
                table: "InventoryBatches");
        }
    }
}
