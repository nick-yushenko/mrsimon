using System.ComponentModel.DataAnnotations;

namespace MrSimon.Api.Dtos.StudyGroups;

public class CreateStudyGroupRequest : IValidatableObject
{
    [Required(ErrorMessage = "Название группы обязательно.")]
    [MaxLength(120, ErrorMessage = "Название группы не должно быть длиннее 120 символов.")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Описание группы не должно быть длиннее 1000 символов.")]
    public string? Description { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Предмет обязателен.")]
    public int SubjectId { get; set; }

    [Range(
        typeof(decimal),
        "0",
        "999999999999.99",
        ErrorMessage = "Цена за занятие должна быть больше или равна 0."
    )]
    public decimal PricePerLesson { get; set; }

    // Дата всегда передается явно: группа может относиться к учебному году, короткому курсу или другому периоду.
    [Required(ErrorMessage = "Дата старта группы обязательна.")]
    public DateOnly? StartsOn { get; set; }

    // Дата всегда передается явно, сервер не вычисляет окончание учебного года автоматически.
    [Required(ErrorMessage = "Дата закрытия группы обязательна.")]
    public DateOnly? EndsOn { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartsOn.HasValue && EndsOn.HasValue && EndsOn.Value < StartsOn.Value)
        {
            yield return new ValidationResult(
                "Дата окончания группы должна быть больше или равна дате начала.",
                new[] { nameof(EndsOn) }
            );
        }

        if (SubjectId <= 0)
        {
            yield return new ValidationResult("Предмет обязателен.", new[] { nameof(SubjectId) });
        }
    }
}
