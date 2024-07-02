using Microsoft.AspNetCore.Mvc;
using Acclaimed.Application.Services;
using Acclaimed.Domain.Entities;

namespace Acclaimed.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();

            if (categories == null)
            {
                return NotFound();
            }

            return Ok(categories);
        }
    }
}
