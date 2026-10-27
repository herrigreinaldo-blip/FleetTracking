using DeliveryFinance.Api.Constants;
using DeliveryFinance.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DeliveryFinance.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider, ILogger logger)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        try
        {
            logger.LogInformation("Applying migrations to database...");
            await context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database.");
            throw;
        }

        // Seed Roles: Admin, Delivery, Customer
        foreach (var roleName in UserRoles.All)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                logger.LogInformation("Seeding role: {Role}", roleName);
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        // Seed primary Admin user: herrigreinaldo@gmail.com / 132Careras@!
        const string adminEmail = "herrigreinaldo@gmail.com";
        const string adminPassword = "132Careras@!";

        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            logger.LogInformation("Seeding Admin user: {Email}", adminEmail);
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "Reinaldo",
                LastName = "Herrig"
            };

            var createResult = await userManager.CreateAsync(adminUser, adminPassword);
            if (createResult.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
                logger.LogInformation("Admin user {Email} created and assigned Admin role successfully.", adminEmail);
            }
            else
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                logger.LogWarning("Failed to create Admin user: {Errors}", errors);
            }
        }
        else
        {
            // Ensure Admin role
            if (!await userManager.IsInRoleAsync(adminUser, UserRoles.Admin))
            {
                await userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
                logger.LogInformation("Assigned Admin role to existing user {Email}.", adminEmail);
            }

            // Ensure password is set to 132Careras@!
            var passwordValid = await userManager.CheckPasswordAsync(adminUser, adminPassword);
            if (!passwordValid)
            {
                var token = await userManager.GeneratePasswordResetTokenAsync(adminUser);
                await userManager.ResetPasswordAsync(adminUser, token, adminPassword);
                logger.LogInformation("Password updated for {Email}.", adminEmail);
            }
        }
    }
}
