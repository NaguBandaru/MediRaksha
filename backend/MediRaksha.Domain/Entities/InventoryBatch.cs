using System;
using MediRaksha.Domain.Common;

namespace MediRaksha.Domain.Entities
{
    public class InventoryBatch : BaseEntity
    {
        public Guid MedicineId { get; set; }
        public Medicine Medicine { get; set; } = null!;

        public string BatchNumber { get; set; } = string.Empty;
        public DateTime ManufacturingDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string MfgLicenseNumber { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int AvailableQuantity { get; set; }
        
        public decimal PurchasePrice { get; set; }
        public decimal SellingPrice { get; set; }
        public decimal MRP { get; set; } // Maximum Retail Price
        public decimal TaxPercentage { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
