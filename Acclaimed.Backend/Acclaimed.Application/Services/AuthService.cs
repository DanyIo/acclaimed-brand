using Acclaimed.Domain.Entities;
using Acclaimed.Domain.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Acclaimed.Application.Exceptions;

namespace Acclaimed.Application.Services
{
    public class AuthService
    {
        private readonly IAuthRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IAuthRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<string> GetMyNameAsync()
        {
            // Implement this based on your user context logic
            return await Task.FromResult("UserName");
        }

        public async Task<(string token, string refreshToken)> RegisterAsync(UserDto request)
        {
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new User
            {
                Username = request.Username,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                RefreshToken = GenerateRefreshToken().Token,
                TokenCreated = DateTime.Now,
                TokenExpires = DateTime.Now.AddDays(7)
            };

            await _userRepository.AddUserAsync(user);

            string token = CreateToken(user);

            return (token, user.RefreshToken);
        }

        public async Task<(string token, string refreshToken)> LoginAsync(UserDto request)
        {
            var user = await _userRepository.GetUserByUsernameAsync(request.Username);

            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new UnauthorizedAccessException("Invalid credentials.");
            }

            string token = CreateToken(user);
            var refreshToken = GenerateRefreshToken();
            SetRefreshToken(refreshToken, user);

            await _userRepository.UpdateUserAsync(user);

            return (token, refreshToken.Token);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _userRepository.GetUserByUsernameAsync(username);
        }

        public async Task<(string token, string refreshToken)> RefreshTokenAsync(string refreshToken)
        {
            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);
            if (user == null || user.TokenExpires < DateTime.Now)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token.");
            }

            string token = CreateToken(user);
            var newRefreshToken = GenerateRefreshToken();
            SetRefreshToken(newRefreshToken, user);

            await _userRepository.UpdateUserAsync(user);

            return (token, newRefreshToken.Token);
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, "User")
    };

            var tokenKey = _configuration["AppSettings:Token"];
            if (string.IsNullOrEmpty(tokenKey))
            {
                // Log the error or handle it appropriately
                throw new InvalidOperationException("Token secret key is not configured.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(45),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }




        private RefreshToken GenerateRefreshToken()
        {
            return new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Created = DateTime.Now,
                Expires = DateTime.Now.AddDays(7)
            };
        }

        private void SetRefreshToken(RefreshToken newRefreshToken, User user)
        {
            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = newRefreshToken.Created;
            user.TokenExpires = newRefreshToken.Expires;
        }
    }
}
