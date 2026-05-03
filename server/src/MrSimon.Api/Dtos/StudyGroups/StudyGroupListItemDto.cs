using MrSimon.Api.Models;

namespace MrSimon.Api.Dtos.StudyGroups;

public class StudyGroupListItemDto
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

    // TODO: позже добавить краткое отображение преподавателей, если оно понадобится в таблице групп.

    public DateTime CreatedAt { get; set; }
}
