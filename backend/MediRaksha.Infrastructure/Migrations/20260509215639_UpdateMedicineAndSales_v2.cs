using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediRaksha.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMedicineAndSales_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SaleItems_InventoryBatches_InventoryBatchId",
                table: "SaleItems");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleItems_Sales_SaleId",
                table: "SaleItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_Users_UserId",
                table: "Sales");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Sales",
                newName: "CreatedByUserId");

            migrationBuilder.RenameColumn(
                name: "PaymentStatus",
                table: "Sales",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "PaymentMethod",
                table: "Sales",
                newName: "PaymentMode");

            migrationBuilder.RenameColumn(
                name: "FinalAmount",
                table: "Sales",
                newName: "NetAmount");

            migrationBuilder.RenameIndex(
                name: "IX_Sales_UserId",
                table: "Sales",
                newName: "IX_Sales_CreatedByUserId");

            migrationBuilder.RenameColumn(
                name: "TotalPrice",
                table: "SaleItems",
                newName: "TotalAmount");

            migrationBuilder.RenameColumn(
                name: "TaxAmount",
                table: "SaleItems",
                newName: "TaxPercentage");

            migrationBuilder.RenameColumn(
                name: "InventoryBatchId",
                table: "SaleItems",
                newName: "MedicineId");

            migrationBuilder.RenameIndex(
                name: "IX_SaleItems_InventoryBatchId",
                table: "SaleItems",
                newName: "IX_SaleItems_MedicineId");

            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "Sales",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomerPhone",
                table: "Sales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DoctorName",
                table: "Sales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "BatchId",
                table: "SaleItems",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercentage",
                table: "SaleItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MRP",
                table: "SaleItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Barcode",
                table: "Medicines",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HSNCode",
                table: "Medicines",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ReorderLevel",
                table: "Medicines",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SaleItems_BatchId",
                table: "SaleItems",
                column: "BatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_SaleItems_InventoryBatches_BatchId",
                table: "SaleItems",
                column: "BatchId",
                principalTable: "InventoryBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleItems_Medicines_MedicineId",
                table: "SaleItems",
                column: "MedicineId",
                principalTable: "Medicines",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleItems_Sales_SaleId",
                table: "SaleItems",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_Users_CreatedByUserId",
                table: "Sales",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SaleItems_InventoryBatches_BatchId",
                table: "SaleItems");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleItems_Medicines_MedicineId",
                table: "SaleItems");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleItems_Sales_SaleId",
                table: "SaleItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_Users_CreatedByUserId",
                table: "Sales");

            migrationBuilder.DropIndex(
                name: "IX_SaleItems_BatchId",
                table: "SaleItems");

            migrationBuilder.DropColumn(
                name: "CustomerName",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "CustomerPhone",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "DoctorName",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "BatchId",
                table: "SaleItems");

            migrationBuilder.DropColumn(
                name: "DiscountPercentage",
                table: "SaleItems");

            migrationBuilder.DropColumn(
                name: "MRP",
                table: "SaleItems");

            migrationBuilder.DropColumn(
                name: "Barcode",
                table: "Medicines");

            migrationBuilder.DropColumn(
                name: "HSNCode",
                table: "Medicines");

            migrationBuilder.DropColumn(
                name: "ReorderLevel",
                table: "Medicines");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Sales",
                newName: "PaymentStatus");

            migrationBuilder.RenameColumn(
                name: "PaymentMode",
                table: "Sales",
                newName: "PaymentMethod");

            migrationBuilder.RenameColumn(
                name: "NetAmount",
                table: "Sales",
                newName: "FinalAmount");

            migrationBuilder.RenameColumn(
                name: "CreatedByUserId",
                table: "Sales",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Sales_CreatedByUserId",
                table: "Sales",
                newName: "IX_Sales_UserId");

            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "SaleItems",
                newName: "TotalPrice");

            migrationBuilder.RenameColumn(
                name: "TaxPercentage",
                table: "SaleItems",
                newName: "TaxAmount");

            migrationBuilder.RenameColumn(
                name: "MedicineId",
                table: "SaleItems",
                newName: "InventoryBatchId");

            migrationBuilder.RenameIndex(
                name: "IX_SaleItems_MedicineId",
                table: "SaleItems",
                newName: "IX_SaleItems_InventoryBatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_SaleItems_InventoryBatches_InventoryBatchId",
                table: "SaleItems",
                column: "InventoryBatchId",
                principalTable: "InventoryBatches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleItems_Sales_SaleId",
                table: "SaleItems",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_Users_UserId",
                table: "Sales",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
