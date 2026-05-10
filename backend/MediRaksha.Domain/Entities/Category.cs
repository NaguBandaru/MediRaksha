using System.Collections.Generic;
using MediRaksha.Domain.Common;

namespace MediRaksha.Domain.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
    }
}
