using System;
using System.Collections.Generic;
using MediRaksha.Domain.Common;

namespace MediRaksha.Domain.Entities
{
    public class Medicine : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string GenericName { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HSNCode { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public int ReorderLevel { get; set; } = 10;
        public bool IsPrescriptionRequired { get; set; } = false;
        public bool IsActive { get; set; } = true;

        // Foreign Keys
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public Guid? SupplierId { get; set; }
        public Supplier? Supplier { get; set; }

        public ICollection<InventoryBatch> InventoryBatches { get; set; } = new List<InventoryBatch>();
    }
}
