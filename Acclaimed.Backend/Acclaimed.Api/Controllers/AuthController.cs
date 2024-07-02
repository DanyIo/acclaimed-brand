using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Acclaimed.Application.Services;
using Acclaimed.Domain.Entities;

namespace Acclaimed.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpGet, Authorize]
        public async Task<ActionResult<string>> GetMe()
        {
            var userName = await _authService.GetMyNameAsync();
            return Ok(userName);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _authService.RegisterAsync(request);
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<string>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("No refresh token provided.");
            }

            var result = await _authService.RefreshTokenAsync(refreshToken);
            return Ok(result);
        }
        [HttpGet("test")]
        public ActionResult<string> Test()
        {
            return Ok("Deployment works!");
        }
    }
}
