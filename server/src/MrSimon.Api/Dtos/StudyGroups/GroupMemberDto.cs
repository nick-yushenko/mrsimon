using MrSimon.Api.Models;

namespace MrSimon.Api.Dtos.StudyGroups;

public class GroupMemberDto
{
    public int Id { get; set; }

    public Guid UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string UserLastName { get; set; } = string.Empty;

    public string UserNote { get; set; } = string.Empty;

    public GroupMemberRole Role { get; set; }

    // NULL означает, что участник использует базовую цену группы из PricePerLesson.
    public decimal? CustomPrice { get; set; }

    public DateTime JoinedAt { get; set; }
}
