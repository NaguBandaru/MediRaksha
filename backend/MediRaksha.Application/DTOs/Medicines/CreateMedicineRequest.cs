using System;

namespace MediRaksha.Application.DTOs.Medicines
{
    public class MedicineDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string GenericName { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HSNCode { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public int ReorderLevel { get; set; }
        public bool IsPrescriptionRequired { get; set; }
        public bool IsActive { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public Guid? SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
    }

    public class CreateMedicineRequest
    {
        public string Name { get; set; } = string.Empty;
        public string GenericName { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HSNCode { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public int ReorderLevel { get; set; } = 10;
        public bool IsPrescriptionRequired { get; set; }
        public Guid CategoryId { get; set; }
        public Guid? SupplierId { get; set; }

        // Initial Batch details
        public string? BatchNumber { get; set; }
        public DateTime? ManufacturingDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? MfgLicenseNumber { get; set; }
        public int? Quantity { get; set; }
        public decimal? PurchasePrice { get; set; }
        public decimal? SellingPrice { get; set; }
        public decimal? MRP { get; set; }
        public decimal? TaxPercentage { get; set; }
    }
}
