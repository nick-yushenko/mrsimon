using System.ComponentModel.DataAnnotations;
using MrSimon.Api.Models;

namespace MrSimon.Api.Dtos.StudyGroups;

public class AddGroupMemberRequest : IValidatableObject
{
    [Required(ErrorMessage = "Пользователь обязателен.")]
    public Guid UserId { get; set; }

    [Required(ErrorMessage = "Роль участника обязательна.")]
    public GroupMemberRole Role { get; set; }

    // NULL означает, что участник использует базовую цену группы из PricePerLesson.
    [Range(
        typeof(decimal),
        "0",
        "999999999999.99",
        ErrorMessage = "Индивидуальная цена должна быть больше или равна 0."
    )]
    public decimal? CustomPrice { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (UserId == Guid.Empty)
        {
            yield return new ValidationResult(
                "Пользователь обязателен.",
                new[] { nameof(UserId) }
            );
        }

        if (!Enum.IsDefined(typeof(GroupMemberRole), Role))
        {
            yield return new ValidationResult(
                "Некорректная роль участника группы.",
                new[] { nameof(Role) }
            );
        }
    }
}
