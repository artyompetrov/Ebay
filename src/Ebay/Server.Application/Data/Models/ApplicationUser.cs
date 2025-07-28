using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Server.Application.Data.Models;

public class ApplicationUser : IdentityUser
{
    public DbSet<Product> Products { get; set; } = null!;
}