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

        // 1. Seed Roles: Admin, Delivery, Customer
        foreach (var roleName in UserRoles.All)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                logger.LogInformation("Seeding role: {Role}", roleName);
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        // 2. Seed primary Admin user: herrigreinaldo@gmail.com
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
                logger.LogInformation("Admin user {Email} created successfully.", adminEmail);
            }
        }

        // 3. Seed Companies (MS Herrig Ltd, TGB Services Ltd, GoConnect)
        var msHerrig = await context.Companies.FirstOrDefaultAsync(c => c.Name == "MS Herrig Ltd");
        if (msHerrig == null)
        {
            msHerrig = new Company
            {
                Name = "MS Herrig Ltd",
                CompanyNumber = "12845678",
                VatNumber = "GB345678901",
                DefaultDirectorSalaryTarget = 5000.00m
            };
            await context.Companies.AddAsync(msHerrig);
        }

        var tgbServices = await context.Companies.FirstOrDefaultAsync(c => c.Name == "TGB Services and Solutions Ltd");
        if (tgbServices == null)
        {
            tgbServices = new Company
            {
                Name = "TGB Services and Solutions Ltd",
                CompanyNumber = "13956789",
                VatNumber = "GB456789012",
                DefaultDirectorSalaryTarget = 5000.00m
            };
            await context.Companies.AddAsync(tgbServices);
        }

        var goConnect = await context.Companies.FirstOrDefaultAsync(c => c.Name == "GoConnect Partnership");
        if (goConnect == null)
        {
            goConnect = new Company
            {
                Name = "GoConnect Partnership",
                CompanyNumber = "OC412345",
                DefaultDirectorSalaryTarget = 0.00m
            };
            await context.Companies.AddAsync(goConnect);
        }

        await context.SaveChangesAsync();

        // 4. Seed Carriers (DPD, Amazon, DHL, DX, Parcel Force)
        var dpd = await context.Carriers.FirstOrDefaultAsync(c => c.Name == "DPD");
        if (dpd == null)
        {
            dpd = new Carrier { Name = "DPD", BillingFormat = CarrierBillingFormat.DpdCsv };
            await context.Carriers.AddAsync(dpd);
        }

        var amazon = await context.Carriers.FirstOrDefaultAsync(c => c.Name == "Amazon");
        if (amazon == null)
        {
            amazon = new Carrier { Name = "Amazon", BillingFormat = CarrierBillingFormat.AmazonCsv };
            await context.Carriers.AddAsync(amazon);
        }

        var dhl = await context.Carriers.FirstOrDefaultAsync(c => c.Name == "DHL");
        if (dhl == null)
        {
            dhl = new Carrier { Name = "DHL", BillingFormat = CarrierBillingFormat.Manual };
            await context.Carriers.AddAsync(dhl);
        }

        var dx = await context.Carriers.FirstOrDefaultAsync(c => c.Name == "DX");
        if (dx == null)
        {
            dx = new Carrier { Name = "DX", BillingFormat = CarrierBillingFormat.Manual };
            await context.Carriers.AddAsync(dx);
        }

        var parcelForce = await context.Carriers.FirstOrDefaultAsync(c => c.Name == "Parcel Force");
        if (parcelForce == null)
        {
            parcelForce = new Carrier { Name = "Parcel Force", BillingFormat = CarrierBillingFormat.Manual };
            await context.Carriers.AddAsync(parcelForce);
        }

        await context.SaveChangesAsync();

        // 5. Seed Franchises (FD codes matching sample sheets)
        var franchisesData = new (string Code, string Depot, Guid CompanyId)[]
        {
            ("FD49693", "Crawley Depot - Bulk 1", msHerrig.Id),
            ("FD51406", "Crawley Depot - Bulk 2", msHerrig.Id),
            ("FD52639", "Brighton Central", msHerrig.Id),
            ("FD54328", "Brighton North East", msHerrig.Id),
            ("FD54330", "Brighton South East", msHerrig.Id),
            ("FD72458", "Worthing MPB", msHerrig.Id),
            ("FD45028", "Crawley South", tgbServices.Id),
            ("FD71764", "Hove Central", tgbServices.Id),
            ("FD72356", "Worthing High Street", tgbServices.Id),
            ("FD74820", "Hove West", tgbServices.Id),
            ("FD77686", "Brighton West Secondary", tgbServices.Id),
            ("FD77890", "Worthing Coastal", tgbServices.Id),
            ("FD77891", "Brighton Seafront", tgbServices.Id),
            ("FD78242", "Brighton Marina Early", tgbServices.Id)
        };

        foreach (var (code, depot, companyId) in franchisesData)
        {
            var normalized = Franchise.NormalizeFdCode(code);
            if (!await context.Franchises.AnyAsync(f => f.FdCode == normalized))
            {
                await context.Franchises.AddAsync(new Franchise
                {
                    FdCode = normalized,
                    DepotName = depot,
                    CarrierId = dpd.Id,
                    CompanyId = companyId
                });
            }
        }

        await context.SaveChangesAsync();

        // 6. Seed Fleet Vehicles (matching KR23XYZ and Sheet2)
        if (!await context.Vehicles.AnyAsync(v => v.Registration == "KR23XYZ"))
        {
            var kr23 = new Vehicle
            {
                Registration = "KR23XYZ",
                Make = "MERCEDES",
                Model = "SPRINTER",
                Year = 2023,
                CurrentMileage = 117000,
                FuelType = FuelType.Diesel,
                OwnershipType = OwnershipType.Financed,
                CompanyId = msHerrig.Id,
                PurchasePrice = 24600.00m,
                DepositPaid = 5000.00m,
                MonthlyFinancePayment = 456.80m,
                FinanceTermMonths = 48,
                RemainingFinanceBalance = 19184.90m,
                Compliance = new VehicleCompliance
                {
                    MotDueDate = DateTime.SpecifyKind(new DateTime(2027, 7, 12), DateTimeKind.Utc),
                    RoadTaxDueDate = DateTime.SpecifyKind(new DateTime(2027, 4, 1), DateTimeKind.Utc),
                    AnnualRoadTaxCost = 360.00m,
                    InsuranceDueDate = DateTime.SpecifyKind(new DateTime(2027, 4, 15), DateTimeKind.Utc),
                    MonthlyInsuranceCost = 274.30m,
                    InsurancePolicyNumber = "P771542333",
                    Insurer = "Admiral",
                    NamedDrivers = "Tulio + Daniel K",
                    BreakdownRecoveryProvider = "RAC Recovery",
                    NextServiceMileage = 139000
                }
            };
            await context.Vehicles.AddAsync(kr23);

            // Add sample service logs from KR23XYZ sheet
            kr23.ServiceLogs.Add(new VehicleServiceLog
            {
                Date = DateTime.SpecifyKind(new DateTime(2026, 4, 18), DateTimeKind.Utc),
                MileageAtService = 117500,
                ServiceDescription = "REAR STEP",
                PartsCost = 150.00m,
                TotalCost = 150.00m,
                SupplierOrGarage = "EBAY"
            });
            kr23.ServiceLogs.Add(new VehicleServiceLog
            {
                Date = DateTime.SpecifyKind(new DateTime(2026, 5, 14), DateTimeKind.Utc),
                MileageAtService = 120071,
                ServiceDescription = "FULL CLUTCH KIT CHANGED",
                LabourCost = 464.40m,
                PartsCost = 1585.14m,
                TotalCost = 2049.54m,
                SupplierOrGarage = "P&D AUTOMOTIVE"
            });
            kr23.ServiceLogs.Add(new VehicleServiceLog
            {
                Date = DateTime.SpecifyKind(new DateTime(2026, 7, 13), DateTimeKind.Utc),
                MileageAtService = 125664,
                ServiceDescription = "MOT INSPECTION & CERTIFICATION",
                LabourCost = 150.00m,
                TotalCost = 150.00m,
                SupplierOrGarage = "SAM MOTORS"
            });
        }

        var additionalVans = new (string Reg, string Make, string Model, FuelType Fuel, OwnershipType Own, Guid CompId, decimal Price, decimal Monthly)[]
        {
            ("EF22VVV", "MERCEDES", "EVITO", FuelType.Electric, OwnershipType.Leased, msHerrig.Id, 32000m, 540.93m),
            ("KN22MMM", "MERCEDES", "SPRINTER", FuelType.Diesel, OwnershipType.Owned, msHerrig.Id, 22000m, 0m),
            ("NX21XXA", "MAXUS", "EDELIVER 3", FuelType.Electric, OwnershipType.Leased, msHerrig.Id, 28000m, 450m),
            ("EA22RRR", "MERCEDES", "EVITO", FuelType.Electric, OwnershipType.Leased, msHerrig.Id, 31000m, 510m),
            ("WX16RRR", "FORD", "TRANSIT", FuelType.Diesel, OwnershipType.SubcontractorOwned, msHerrig.Id, 12000m, 0m),
            ("MA22TTT", "MERCEDES", "SPRINTER", FuelType.Diesel, OwnershipType.Owned, msHerrig.Id, 23500m, 0m),
            ("EO73XYZ", "MAXUS", "EDELIVER 9", FuelType.Electric, OwnershipType.Leased, tgbServices.Id, 38000m, 620m),
            ("DA20XYZ", "FORD", "TRANSIT CUSTOM", FuelType.Diesel, OwnershipType.Owned, tgbServices.Id, 18500m, 0m),
            ("HX72XYZ", "MERCEDES", "SPRINTER", FuelType.Diesel, OwnershipType.Financed, tgbServices.Id, 25000m, 441.72m)
        };

        foreach (var van in additionalVans)
        {
            var normalizedReg = Vehicle.NormalizeRegistration(van.Reg);
            if (!await context.Vehicles.AnyAsync(v => v.Registration == normalizedReg))
            {
                await context.Vehicles.AddAsync(new Vehicle
                {
                    Registration = normalizedReg,
                    Make = van.Make,
                    Model = van.Model,
                    FuelType = van.Fuel,
                    OwnershipType = van.Own,
                    CompanyId = van.CompId,
                    PurchasePrice = van.Price,
                    MonthlyFinancePayment = van.Monthly,
                    Compliance = new VehicleCompliance
                    {
                        MotDueDate = DateTime.SpecifyKind(DateTime.UtcNow.AddMonths(10), DateTimeKind.Utc),
                        RoadTaxDueDate = DateTime.SpecifyKind(DateTime.UtcNow.AddMonths(6), DateTimeKind.Utc),
                        InsuranceDueDate = DateTime.SpecifyKind(DateTime.UtcNow.AddMonths(8), DateTimeKind.Utc),
                        Insurer = "Admiral Business",
                        NextServiceMileage = 130000
                    }
                });
            }
        }

        await context.SaveChangesAsync();

        // 7. Seed Drivers, Identity Users, Profiles, and Escrow Deposits
        var driversData = new (string Name, string Email, string Dr, decimal VanCost, decimal DayRate, decimal StopRate, RateModel Rate, decimal DepositBal, bool OwnVan)[]
        {
            ("Ronaldo Luiz Silva", "ronaldo.delivery@deliveryapp.com", "DR85899", 1300.00m, 200.00m, 0m, RateModel.DayRate, 0.00m, false),
            ("Octavio Santos", "octavio.delivery@deliveryapp.com", "DR80699", 0.00m, 200.00m, 0m, RateModel.DayRate, 0.00m, true),
            ("Natalie Gomez", "natalie.delivery@deliveryapp.com", "DR100799", 870.67m, 200.00m, 0m, RateModel.DayRate, 0.00m, false),
            ("Thiago Oliveira", "thiago.delivery@deliveryapp.com", "DR65457", 1224.91m, 200.00m, 0m, RateModel.DayRate, 0.00m, false),
            ("Kauann Rodrigues", "kauann.delivery@deliveryapp.com", "DR88699", 1501.81m, 200.00m, 0m, RateModel.DayRate, 0.00m, false),
            ("Henrry Barbosa", "henrry.delivery@deliveryapp.com", "DR799199", 1600.00m, 200.00m, 0m, RateModel.DayRate, 1000.00m, false),
            ("Luciano Lima", "luciano.delivery@deliveryapp.com", "DR84199", 1080.00m, 200.00m, 0m, RateModel.DayRate, 0.00m, false),
            ("Jaderson Costa", "jaderson.delivery@deliveryapp.com", "DR85299", 1612.02m, 200.00m, 0m, RateModel.DayRate, 0.00m, false),
            ("Emanuel Pereira", "emanuel.delivery@deliveryapp.com", "DR61299", 1332.42m, 0m, 1.95m, RateModel.StopRate, 0.00m, false),
            ("Daniel K", "danielk.delivery@deliveryapp.com", "DR79599", 1500.00m, 0m, 1.95m, RateModel.StopRate, 1000.00m, false),
            ("Lucas Martins", "lucas.delivery@deliveryapp.com", "DR79499", 1600.00m, 0m, 1.95m, RateModel.StopRate, 800.00m, false),
            ("Bruno Carvalho", "bruno.delivery@deliveryapp.com", "DR09099", 1124.30m, 0m, 0m, RateModel.AdminFeeCommission, 0.00m, false),
            ("David Ferreira", "david.delivery@deliveryapp.com", "DR06499", 1086.55m, 0m, 0m, RateModel.AdminFeeCommission, 0.00m, false)
        };

        const string defaultDriverPassword = "DriverPassword123!";

        foreach (var d in driversData)
        {
            var user = await userManager.FindByEmailAsync(d.Email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = d.Email,
                    Email = d.Email,
                    EmailConfirmed = true,
                    FirstName = d.Name.Split(' ')[0],
                    LastName = d.Name.Contains(' ') ? d.Name.Substring(d.Name.IndexOf(' ') + 1) : "Driver"
                };

                var res = await userManager.CreateAsync(user, defaultDriverPassword);
                if (res.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, UserRoles.Delivery);
                }
            }

            var normalizedDr = DriverProfile.NormalizeDrNumber(d.Dr);
            if (!await context.DriverProfiles.AnyAsync(dp => dp.DrNumber == normalizedDr))
            {
                var profile = new DriverProfile
                {
                    UserId = user.Id,
                    DrNumber = normalizedDr,
                    FullName = d.Name,
                    Phone = "07" + new Random().Next(10000000, 99999999),
                    Address = "Brighton & Hove Area, UK",
                    BankName = "Monzo Bank",
                    BankSortCode = "04-00-20",
                    BankAccountNumber = "75452011",
                    RateType = d.Rate,
                    DefaultDayRate = d.DayRate,
                    DefaultStopRate = d.StopRate,
                    AdminFeePercentage = 6.00m,
                    SuppliesOwnVan = d.OwnVan,
                    PeriodicVanRent = d.VanCost,
                    Deposit = new DriverDeposit
                    {
                        TargetDeposit = 1000.00m,
                        CurrentBalance = d.DepositBal,
                        InstallmentAmount = 200.00m
                    }
                };

                await context.DriverProfiles.AddAsync(profile);
            }
        }

        await context.SaveChangesAsync();

        // 8. Seed Bank Accounts
        if (!await context.BankAccounts.AnyAsync(b => b.CompanyId == msHerrig.Id))
        {
            await context.BankAccounts.AddAsync(new BankAccount
            {
                CompanyId = msHerrig.Id,
                BankName = "NatWest Business Banking",
                AccountNumber = "11223344",
                SortCode = "60-00-01",
                InitialBalance = 1757.81m,
                CurrentBalance = 1757.81m
            });
        }

        if (!await context.BankAccounts.AnyAsync(b => b.CompanyId == tgbServices.Id))
        {
            await context.BankAccounts.AddAsync(new BankAccount
            {
                CompanyId = tgbServices.Id,
                BankName = "NatWest Business Banking",
                AccountNumber = "55667788",
                SortCode = "60-00-02",
                InitialBalance = 3794.50m,
                CurrentBalance = 3794.50m
            });
        }

        if (!await context.BankAccounts.AnyAsync(b => b.CompanyId == goConnect.Id))
        {
            await context.BankAccounts.AddAsync(new BankAccount
            {
                CompanyId = goConnect.Id,
                BankName = "NatWest Partnership Account",
                AccountNumber = "99887766",
                SortCode = "60-00-03",
                InitialBalance = 0.00m,
                CurrentBalance = 0.00m
            });
        }

        // 9. Seed Standard Delivery Routes
        var routesData = new (string Code, string Area, decimal Multiplier)[]
        {
            ("SPARE", "Crawley Depot Spare", 1.00m),
            ("BULK", "Crawley Bulk Runs", 1.20m),
            ("105", "BN1.6/7 Early", 1.30m),
            ("202", "BN1.2 Bulk", 1.20m),
            ("203", "BN1.3 Second", 1.45m),
            ("205", "BN1.6/7 Second", 1.30m),
            ("207", "BN1.5 Second", 1.30m),
            ("208", "BN3.1/2 Second", 2.00m),
            ("211", "BN1.9 Bulk/Standard", 2.00m),
            ("242", "BN11.1/2 Early", 1.45m),
            ("243", "BN11.3/4 Second", 1.10m),
            ("252", "Bulk Route 252", 1.20m),
            ("305", "BN 1 Bulk Special", 3.00m),
            ("401", "BN1.5/6/7 Smalls", 3.00m),
            ("587", "Worthing MPB", 3.00m),
            ("593", "BN 1 Bulk Commercial", 3.00m)
        };

        foreach (var r in routesData)
        {
            if (!await context.RouteDefinitions.AnyAsync(rd => rd.RouteCode == r.Code))
            {
                await context.RouteDefinitions.AddAsync(new RouteDefinition
                {
                    RouteCode = r.Code,
                    DepotArea = r.Area,
                    DefaultRateMultiplier = r.Multiplier,
                    CarrierId = dpd.Id
                });
            }
        }

        // 10. Seed Initial 4-Week Pay Period (12-Oct-2026 to 08-Nov-2026, paid 13-Nov-2026)
        var samplePeriodStart = DateTime.SpecifyKind(new DateTime(2026, 10, 12), DateTimeKind.Utc);
        var samplePeriodEnd = DateTime.SpecifyKind(new DateTime(2026, 11, 8), DateTimeKind.Utc);
        var samplePayDate = DateTime.SpecifyKind(new DateTime(2026, 11, 13), DateTimeKind.Utc);

        if (!await context.PayPeriods.AnyAsync(p => p.StartDate == samplePeriodStart && p.EndDate == samplePeriodEnd))
        {
            await context.PayPeriods.AddAsync(new PayPeriod
            {
                PeriodType = PayPeriodType.FourWeekly,
                StartDate = samplePeriodStart,
                EndDate = samplePeriodEnd,
                PaymentDate = samplePayDate,
                Status = PayPeriodStatus.Open
            });
        }

        await context.SaveChangesAsync();
        logger.LogInformation("Database seeded successfully with multi-entity logistics and finance sample data.");
    }
}
