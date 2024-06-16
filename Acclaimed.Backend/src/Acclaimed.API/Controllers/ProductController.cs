using Microsoft.AspNetCore.Mvc;
using Acclaimed.Application.Services;
using Acclaimed.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Diagnostics;

namespace Acclaimed.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAllProducts()
        {
            var products = await _productService.GetAllProductsAsync();

            if (products == null)
            {
                return NotFound();
            }
            return Ok(products);
        }
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<List<Product>>> GetProductsByCategory(int categoryId)
        {
            var products = await _productService.GetProductsByCategoryAsync(categoryId);
            if (products == null)
            {
                return NotFound();
            }

            return Ok(products);
        }
        [HttpGet("{productId}")]
        public async Task<ActionResult<Product>> GetProductById(int productId)
        {
            var product = await _productService.GetProductByIdAsync(productId);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
    }
}
