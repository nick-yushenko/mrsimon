using Microsoft.EntityFrameworkCore;
using MrSimon.Api.Models;

namespace MrSimon.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<Subject> Subjects { get; set; }

    public DbSet<StudyGroup> StudyGroups { get; set; }

    public DbSet<GroupMember> GroupMembers { get; set; }

		// TODO вынести отдельно
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);

            entity.HasIndex(user => user.Email).IsUnique();

            entity.Property(user => user.Name).IsRequired();

            entity.Property(user => user.LastName).IsRequired();

            entity.Property(user => user.Email).IsRequired();

            entity.Property(user => user.PasswordHash).IsRequired();

            entity.Property(user => user.Role).IsRequired();

            entity.Property(user => user.CreatedAt).IsRequired();

            entity.Property(user => user.UpdatedAt).IsRequired();
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(subject => subject.Id);

            entity.HasIndex(subject => subject.Name).IsUnique();

            entity.Property(subject => subject.Name).IsRequired().HasMaxLength(120);

            entity.Property(subject => subject.Description).HasMaxLength(1000);

            entity.Property(subject => subject.CreatedAt).IsRequired();

            entity.Property(subject => subject.UpdatedAt).IsRequired();
        });

        modelBuilder.Entity<StudyGroup>(entity =>
        {
            entity.HasKey(group => group.Id);

            entity.Property(group => group.Name).IsRequired().HasMaxLength(120);

            entity.Property(group => group.Description).HasMaxLength(1000);

            entity.Property(group => group.PricePerLesson).HasPrecision(18, 2);

            entity.Property(group => group.Status).IsRequired();

            entity.Property(group => group.CreatedAt).IsRequired();

            entity.Property(group => group.UpdatedAt).IsRequired();

            entity
                .HasOne(group => group.Subject)
                .WithMany(subject => subject.Groups)
                .HasForeignKey(group => group.SubjectId);
        });

        modelBuilder.Entity<GroupMember>(entity =>
        {
            entity.HasKey(member => member.Id);

            entity.HasIndex(member => new { member.GroupId, member.UserId }).IsUnique();

            entity.Property(member => member.Role).IsRequired();

            entity.Property(member => member.CustomPrice).HasPrecision(18, 2);

            entity.Property(member => member.JoinedAt).IsRequired();

            entity
                .HasOne(member => member.Group)
                .WithMany(group => group.Members)
                .HasForeignKey(member => member.GroupId);

            entity.HasOne(member => member.User).WithMany().HasForeignKey(member => member.UserId);
        });
    }
}
