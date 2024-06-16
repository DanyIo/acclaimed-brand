// Domain layer (Acclaimed.Domain.Repositories)
using Acclaimed.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Acclaimed.Domain.Repositories
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllProductsAsync();

        Task<List<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<Product?> GetProductByIdAsync(int productId);
    }
}
