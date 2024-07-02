using Acclaimed.Domain.Entities;
using Acclaimed.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Acclaimed.Infrastructure.Data;

namespace Acclaimed.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;

        public ProductRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<List<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            return await _context.Products.Where(p => p.CategoryID == categoryId).ToListAsync();
        }
        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            return await _context.Products
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(p => p.ProductID == productId);
        }
    }
}
