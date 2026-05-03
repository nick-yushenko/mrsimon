namespace MrSimon.Api.Dtos.Users;

public class SummaryDto
{
    public int Total { get; set; }

    public decimal MonthlyGrowthPercent { get; set; }

    public List<MonthlyUsersCountDto> MonthlyCounts { get; set; } = [];
}

public class MonthlyUsersCountDto
{
    public int Year { get; set; }

    public int Month { get; set; }

    public int Count { get; set; }
}
