using Microsoft.EntityFrameworkCore;

namespace TraigiamBE.Models
{
    public class PrisonDBContext : DbContext
    {
        public PrisonDBContext(DbContextOptions<PrisonDBContext> options) : base(options)
        {

        }
        public DbSet<PrisonerModel> Prisoner { get; set; }
        public DbSet<StaffModel> Staff { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }
    }
}
