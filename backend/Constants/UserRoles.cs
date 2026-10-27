namespace DeliveryFinance.Api.Constants;

public static class UserRoles
{
    public const string Admin = "Admin";
    public const string Delivery = "Delivery";
    public const string Customer = "Customer";

    public static readonly IReadOnlyList<string> All = new[] { Admin, Delivery, Customer };
}
