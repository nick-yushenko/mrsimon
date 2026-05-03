using MrSimon.Api.Models;

namespace MrSimon.Api.Dtos.StudyGroups;

public class StudyGroupDetailsDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int SubjectId { get; set; }

    public string SubjectName { get; set; } = string.Empty;

    public decimal PricePerLesson { get; set; }

    public DateOnly StartsOn { get; set; }

    public DateOnly EndsOn { get; set; }

    public GroupStatus Status { get; set; }

    // Считаем только учеников, без преподавателей и других будущих ролей участников.
    public int StudentsCount { get; set; }

    // В деталях группы можно возвращать участников; список групп лучше держать более простым.
    public List<GroupMemberDto> Members { get; set; } = new();

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
