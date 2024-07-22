using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Acclaimed.Application.Services;
using Acclaimed.Domain.Entities;
using Acclaimed.Application.Exceptions;
using Microsoft.AspNetCore.Http;

namespace Acclaimed.API.Controllers
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
        public async Task<IActionResult> Register(UserDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _authService.GetUserByUsernameAsync(request.Username);
            if (existingUser != null)
            {
                return Conflict(new { message = "Username already taken. Please, login." });
            }

            var result = await _authService.RegisterAsync(request);

            SetRefreshTokenCookie(result.refreshToken);


            return Ok(new { token = result.token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);

                SetRefreshTokenCookie(result.refreshToken);


                return Ok(new { token = result.token });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal server error: ", ex });
            }
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

            SetRefreshTokenCookie(result.refreshToken);


            return Ok(new { token = result.token });
        }

        [HttpGet("test")]
        public ActionResult<string> Test()
        {
            return Ok("Deployment works!");
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddDays(7),
                Path = "/"
            };
            Response.Cookies.Append("refreshToken", refreshToken, options);
        }



    }
}
