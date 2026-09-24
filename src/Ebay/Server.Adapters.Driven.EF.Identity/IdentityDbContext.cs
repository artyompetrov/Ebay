using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Server.Adapters.Driven.EF.Identity;

/// <summary>
/// Dedicated DbContext for ASP.NET Identity and Duende IdentityServer's operational store - split out of the
/// legacy monolithic ApplicationDbContext so this project only ever depends on Identity/IdentityServer packages.
/// </summary>
public sealed class IdentityDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
    public IdentityDbContext(
        DbContextOptions<IdentityDbContext> options,
        IOptions<OperationalStoreOptions> operationalStoreOptions)
        : base(options: options, operationalStoreOptions: operationalStoreOptions)
    {
    }
}
