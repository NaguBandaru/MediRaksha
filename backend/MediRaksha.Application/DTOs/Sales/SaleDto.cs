using System;
using System.Collections.Generic;

namespace MediRaksha.Application.DTOs.Sales
{
    public class SaleDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime SaleDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerPhone { get; set; }
        public string? DoctorName { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal NetAmount { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string CreatedByUserName { get; set; } = string.Empty;
        public List<SaleItemDto> Items { get; set; } = new();
    }

    public class SaleItemDto
    {
        public Guid MedicineId { get; set; }
        public string MedicineName { get; set; } = string.Empty;
        public string BatchNumber { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal MRP { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class CreateSaleRequest
    {
        public string CustomerName { get; set; } = "Walk-in Customer";
        public string? CustomerPhone { get; set; }
        public string? DoctorName { get; set; }
        public string PaymentMode { get; set; } = "Cash";
        public decimal DiscountAmount { get; set; }
        public List<CreateSaleItemRequest> Items { get; set; } = new();
    }

    public class CreateSaleItemRequest
    {
        public Guid MedicineId { get; set; }
        public Guid BatchId { get; set; }
        public int Quantity { get; set; }
        public decimal DiscountPercentage { get; set; }
    }
}
