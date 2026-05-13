using Microsoft.EntityFrameworkCore;
using MediRaksha.Domain.Entities;
using MediRaksha.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace MediRaksha.Infrastructure.Persistence
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var passwordHasher = serviceProvider.GetRequiredService<IPasswordHasher>();

            await context.Database.MigrateAsync();

            if (await context.Categories.AnyAsync())
            {
                return; // DB has been seeded
            }

            var adminRole = new Role
            {
                Id = Guid.NewGuid(),
                Name = "Admin",
                Description = "Administrator with full access"
            };

            var staffRole = new Role
            {
                Id = Guid.NewGuid(),
                Name = "Staff",
                Description = "Regular staff with limited access"
            };

            await context.Roles.AddRangeAsync(adminRole, staffRole);

            // Seed Categories
            var antibiotics = new Category { Id = Guid.NewGuid(), Name = "Antibiotics", Description = "Bacterial infection treatments" };
            var painkillers = new Category { Id = Guid.NewGuid(), Name = "Painkillers", Description = "Pain relief medicines" };
            await context.Categories.AddRangeAsync(antibiotics, painkillers);

            // Seed Suppliers
            var globalMeds = new Supplier 
            { 
                Id = Guid.NewGuid(), 
                Name = "Global Meds", 
                ContactPerson = "John Doe", 
                Email = "contact@globalmeds.com", 
                Phone = "9876543210", 
                Address = "123 Pharma St", 
                GSTNumber = "27AAAAA0000A1Z5" 
            };
            await context.Suppliers.AddAsync(globalMeds);

            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                FullName = "Admin User",
                UserName = "admin@mediraksha.com",
                Email = "admin@mediraksha.com",
                PasswordHash = passwordHasher.HashPassword("Admin@123"),
                PhoneNumber = "1234567890",
                IsActive = true
            };

            await context.Users.AddAsync(adminUser);

            await context.UserRoles.AddAsync(new UserRole
            {
                UserId = adminUser.Id,
                RoleId = adminRole.Id
            });

            await context.SaveChangesAsync();
        }
    }
}
