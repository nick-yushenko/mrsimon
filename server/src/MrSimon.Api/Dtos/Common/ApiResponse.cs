namespace MrSimon.Api.Dtos.Common;

public sealed class ApiResponse<T>
{
    public T? Data { get; init; }

    public object? Meta { get; init; }
}
