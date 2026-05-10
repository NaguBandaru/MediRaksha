using System;
using System.Collections.Generic;
using MediRaksha.Domain.Common;

namespace MediRaksha.Domain.Entities
{
    public class Sale : BaseEntity
    {
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        
        public string CustomerName { get; set; } = "Walk-in Customer";
        public string? CustomerPhone { get; set; }
        public string? DoctorName { get; set; }

        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal NetAmount { get; set; }

        public string PaymentMode { get; set; } = "Cash"; // Cash, Card, UPI
        public string Status { get; set; } = "Completed"; // Completed, Held, Cancelled

        public Guid CreatedByUserId { get; set; }
        public User CreatedByUser { get; set; } = null!;

        public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    }
}
