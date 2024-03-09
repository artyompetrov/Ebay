using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Ebay.Server.Data.Models;

internal class ApplicationUser : IdentityUser
{
    public DbSet<Product> Products { get; set; } = null!;
}