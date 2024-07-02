using Microsoft.EntityFrameworkCore;
using Acclaimed.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace Acclaimed.Infrastructure.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>()
                .HasDiscriminator<string>("Discriminator")
                .HasValue<HeadHook>("HeadHook")
                .HasValue<FishingRod>("FishingRod");

            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<HeadHook>().ToTable("Products");
            modelBuilder.Entity<FishingRod>().ToTable("Products");
        }
    }
}
