using System.ComponentModel.DataAnnotations;

namespace MrSimon.Api.Dtos.Subjects;

public class CreateSubjectRequest
{
    [Required(ErrorMessage = "Название дисциплины обязательно.")]
    [MaxLength(120, ErrorMessage = "Название дисциплины не должно быть длиннее 120 символов.")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Описание дисциплины не должно быть длиннее 1000 символов.")]
    public string? Description { get; set; }
}
