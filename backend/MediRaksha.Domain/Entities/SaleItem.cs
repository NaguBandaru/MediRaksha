using System;
using MediRaksha.Domain.Common;

namespace MediRaksha.Domain.Entities
{
    public class SaleItem : BaseEntity
    {
        public Guid SaleId { get; set; }
        public Sale Sale { get; set; } = null!;

        public Guid MedicineId { get; set; }
        public Medicine Medicine { get; set; } = null!;

        public Guid BatchId { get; set; }
        public InventoryBatch Batch { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal MRP { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
