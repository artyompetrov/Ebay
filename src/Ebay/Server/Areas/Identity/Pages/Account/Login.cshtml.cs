using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Server.Adapters.Driven.EF.Identity;

namespace Server.Areas.Identity.Pages.Account;

/// <summary>
/// Sign-in page scaffolded from ASP.NET Core Identity UI 10.0.0 (Bootstrap 5). Owned by the project only to remove
/// the links to self-service registration from its markup; the sign-in logic is the framework's, unchanged.
/// Re-scaffold it when the Identity UI package moves to a new major version.
/// </summary>
[AllowAnonymous]
internal sealed class Login : PageModel
{
    private static readonly EventId UserLoginEventId = new(3, "UserLogin");
    private static readonly EventId UserLockoutEventId = new(4, "UserLockout");

    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ILogger<Login> _logger;

    public Login(SignInManager<ApplicationUser> signInManager, ILogger<Login> logger)
    {
        _signInManager = signInManager;
        _logger = logger;
    }

    [BindProperty]
    public InputModel Input { get; set; } = new();

    public IList<AuthenticationScheme>? ExternalLogins { get; private set; }

    public string? ReturnUrl { get; private set; }

    [TempData]
    public string? ErrorMessage { get; set; }

    public async Task OnGetAsync([StringSyntax(StringSyntaxAttribute.Uri)] string? returnUrl = null)
    {
        if (!string.IsNullOrEmpty(ErrorMessage))
        {
            ModelState.AddModelError(string.Empty, ErrorMessage);
        }

        returnUrl ??= Url.Content("~/");

        // Clear the existing external cookie to ensure a clean login process
        await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

        ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

        ReturnUrl = returnUrl;
    }

    public async Task<IActionResult> OnPostAsync([StringSyntax(StringSyntaxAttribute.Uri)] string? returnUrl = null)
    {
        returnUrl ??= Url.Content("~/");

        ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

        if (ModelState.IsValid)
        {
            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, set lockoutOnFailure: true
            var result = await _signInManager.PasswordSignInAsync(Input.Email, Input.Password, Input.RememberMe, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                _logger.LogInformation(UserLoginEventId, "User logged in.");
                return LocalRedirect(returnUrl);
            }

            if (result.RequiresTwoFactor)
            {
                return RedirectToPage("./LoginWith2fa", new { ReturnUrl = returnUrl, Input.RememberMe });
            }

            if (result.IsLockedOut)
            {
                _logger.LogWarning(UserLockoutEventId, "User account locked out.");
                return RedirectToPage("./Lockout");
            }

            ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            return Page();
        }

        // If we got this far, something failed, redisplay form
        return Page();
    }

    internal sealed record InputModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; init; } = string.Empty;

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; init; }
    }
}
