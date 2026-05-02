using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MrSimon.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteForeUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Users");
        }
    }
}
