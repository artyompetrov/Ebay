namespace Server.Adapters.Smtp
{
    public class SmtpSettings
    {
        public string Server { get; set; } = null!;
        public int Port { get; set; }
        public string Login { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Email { get; set; } = null!;

    }
}