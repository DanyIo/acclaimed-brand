// Domain layer (Acclaimed.Domain.Repositories)
using Acclaimed.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Acclaimed.Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllCategoriesAsync();

    }
}
