using System.Collections.Generic;
using MediRaksha.Domain.Common;

namespace MediRaksha.Domain.Entities
{
    public class Supplier : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
    }
}
