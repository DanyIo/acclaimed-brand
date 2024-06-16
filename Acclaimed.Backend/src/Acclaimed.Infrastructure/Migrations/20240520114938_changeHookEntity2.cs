using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Acclaimed.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class changeHookEntity2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Weight",
                table: "Products",
                newName: "Weights");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Weights",
                table: "Products",
                newName: "Weight");
        }
    }
}
