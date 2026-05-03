using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MrSimon.Api.Models;

public class StudyGroup
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Название группы обязательно.")]
    [MaxLength(120, ErrorMessage = "Название группы не должно быть длиннее 120 символов.")]
    public string Name { get; set; } = null!;

    [MaxLength(1000, ErrorMessage = "Описание группы не должно быть длиннее 1000 символов.")]
    public string? Description { get; set; }

    // Предмет шире языка: английский, математика, программирование и т.д.
    public int SubjectId { get; set; }

    public Subject Subject { get; set; } = null!;

    // Базовая цена за одно занятие. Индивидуальная цена ученика хранится в GroupMember.CustomPrice.
    [Column(TypeName = "decimal(18,2)")]
    [Range(
        typeof(decimal),
        "0",
        "999999999999.99",
        ErrorMessage = "Цена за занятие должна быть больше или равна 0."
    )]
    public decimal PricePerLesson { get; set; }

    // Точная дата начала группы. Сервер не вычисляет учебный год автоматически.
    public DateOnly StartsOn { get; set; }

    // Точная дата окончания группы. Может быть учебный год, несколько месяцев или другой период.
    public DateOnly EndsOn { get; set; }

    public GroupStatus Status { get; set; } = GroupStatus.Active;

    // Участники группы. Пользователь может состоять в нескольких группах, а группа содержит много пользователей.
    public ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class GroupMember
{
    public int Id { get; set; }

    public int GroupId { get; set; }

    public StudyGroup Group { get; set; } = null!;

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public GroupMemberRole Role { get; set; }

    // NULL означает, что участник платит базовую цену группы из PricePerLesson.
    [Column(TypeName = "decimal(18,2)")]
    [Range(
        typeof(decimal),
        "0",
        "999999999999.99",
        ErrorMessage = "Индивидуальная цена должна быть больше или равна 0."
    )]
    public decimal? CustomPrice { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}

public class Subject
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Название предмета обязательно.")]
    [MaxLength(120, ErrorMessage = "Название предмета не должно быть длиннее 120 символов.")]
    public string Name { get; set; } = null!;

    [MaxLength(1000, ErrorMessage = "Описание предмета не должно быть длиннее 1000 символов.")]
    public string? Description { get; set; }

    public ICollection<StudyGroup> Groups { get; set; } = new List<StudyGroup>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GroupStatus
{
    Active = 1,
    Archived = 2,
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GroupMemberRole
{
    Student = 1,
    Teacher = 2,
}
