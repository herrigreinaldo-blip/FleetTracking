namespace DeliveryFinance.Api.Models;

/// <summary>
/// Billing format supported by the carrier.
/// </summary>
public enum CarrierBillingFormat
{
    DpdCsv = 1,
    AmazonCsv = 2,
    Manual = 3
}

/// <summary>
/// Pricing / payment calculation model for subcontracted drivers.
/// </summary>
public enum RateModel
{
    DayRate = 1,
    StopRate = 2,
    AdminFeeCommission = 3
}

/// <summary>
/// Type of transaction applied to a driver's van security deposit escrow.
/// </summary>
public enum DepositTransactionType
{
    Deduction = 1,
    Refund = 2,
    Forfeit = 3
}

/// <summary>
/// Vehicle fuel / energy type.
/// </summary>
public enum FuelType
{
    Diesel = 1,
    Electric = 2
}

/// <summary>
/// Vehicle ownership / financing classification.
/// </summary>
public enum OwnershipType
{
    Owned = 1,
    Financed = 2,
    Leased = 3,
    SubcontractorOwned = 4
}

/// <summary>
/// Vehicle document category stored in the document vault.
/// </summary>
public enum VehicleDocumentType
{
    MotCertificate = 1,
    InsuranceCertificate = 2,
    V5CLogbook = 3,
    LeaseAgreement = 4,
    InspectionReport = 5
}

/// <summary>
/// Status of a daily roster shift.
/// </summary>
public enum ShiftStatus
{
    Scheduled = 1,
    Completed = 2,
    Cancelled = 3,
    CoveredByOther = 4
}

/// <summary>
/// Classification of a driver absence.
/// </summary>
public enum AbsenceType
{
    Holiday = 1,
    Sickness = 2,
    DayOff = 3,
    Emergency = 4
}

/// <summary>
/// Direction of cashflow on a corporate bank account.
/// </summary>
public enum TransactionType
{
    Inflow = 1,
    Outflow = 2,
    Transfer = 3
}

/// <summary>
/// Categorization of corporate revenue and expenses (matches SETEMBRO-26 sheet).
/// </summary>
public enum ExpenseCategory
{
    CarrierRevenue = 1,
    DriverPayout = 2,
    DriverAdvance = 3,
    FuelDiesel = 4,
    FuelElectric = 5,
    VanFinance = 6,
    FleetInsurance = 7,
    VehicleMaintenance = 8,
    OtherVanExpenses = 9,
    AdminAccountancy = 10,
    BankCharges = 11,
    MaterialsTools = 12,
    PersonalDrawing = 13,
    IntercompanyTransfer = 14,
    Other = 15
}

/// <summary>
/// Status of a quarterly UK VAT return (HMRC Making Tax Digital).
/// </summary>
public enum VatReturnStatus
{
    Draft = 1,
    Submitted = 2,
    Paid = 3
}

/// <summary>
/// Length / frequency of an operational driver pay cycle.
/// </summary>
public enum PayPeriodType
{
    FourWeekly = 1,
    Weekly = 2,
    Monthly = 3
}

/// <summary>
/// Operational status of a pay period.
/// </summary>
public enum PayPeriodStatus
{
    Open = 1,
    Calculating = 2,
    Approved = 3,
    Finalized = 4
}

/// <summary>
/// Fleet fuel card issuer/provider.
/// </summary>
public enum FuelCardProvider
{
    Shell = 1,
    BpPulse = 2,
    Keyfuels = 3,
    Allstar = 4,
    Other = 5
}

/// <summary>
/// Carrier billing reconciliation status (comparing agreed route pricing against carrier remittance).
/// </summary>
public enum DisputeStatus
{
    Matched = 1,
    Underpaid = 2,
    Overpaid = 3,
    Disputed = 4,
    Settled = 5
}
