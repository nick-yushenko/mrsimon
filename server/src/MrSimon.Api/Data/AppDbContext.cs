using Microsoft.EntityFrameworkCore;
using MrSimon.Api.Models;

namespace MrSimon.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }

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
    }
}
