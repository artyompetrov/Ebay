using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Domain.Product;

namespace Server.Application.Data;

public class ApplicationUser : IdentityUser
{
    public DbSet<Product> Products { get; set; } = null!;
}