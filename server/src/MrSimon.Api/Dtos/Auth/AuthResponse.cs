namespace MrSimon.Api.Dtos.Auth;

public class AuthResponse
{
    public UserDto User { get; set; } = new();
    public string AccessToken { get; set; } = string.Empty;
}
