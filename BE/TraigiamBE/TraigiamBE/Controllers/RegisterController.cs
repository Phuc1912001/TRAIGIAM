
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
 
    public class RegisterController : ControllerBase
    {
        private readonly PrisonDBContext _context;
       
        public RegisterController(PrisonDBContext context)
        {
            _context = context;
           
        }
        [HttpPost("register")]
        public async Task<ActionResult<BaseResponseModel>> Register([FromBody] RegisterModel registerModel)
        {
            BaseResponseModel response = new BaseResponseModel();

            // Kiểm tra xem tên người dùng hoặc email đã tồn tại chưa
            var existingUser = await _context.RegisterModels.FirstOrDefaultAsync(u => u.UserName == registerModel.UserName || u.Email == registerModel.Email);

            if (existingUser != null)
            {
                response.Status = false;
                response.StatusMessage = "Tên người dùng hoặc email đã tồn tại";
                return Conflict(response); // Trả về mã HTTP 409 Conflict
            }

            // Tạo người dùng mới
            var newUser = new RegisterModel
            {
                UserName = registerModel.UserName,
                Email = registerModel.Email,
                Password = registerModel.Password, // Trong thực tế, cần phải mã hóa mật khẩu
                Role = registerModel.Role ?? 0 // Mặc định là 0 hoặc một giá trị khác
            };

            // Thêm vào cơ sở dữ liệu
            await _context.RegisterModels.AddAsync(newUser);
            await _context.SaveChangesAsync();

            response.Status = true;
            response.Data = newUser;
            response.StatusMessage = "Đăng ký thành công";
            return Ok(response); // Trả về mã HTTP 200 OK
        }

        [HttpPost("login")]
        public async Task<ActionResult<BaseResponseModel>> Login([FromBody] RegisterModel loginModel)
        {
            BaseResponseModel response = new BaseResponseModel();

            // Tìm người dùng bằng tên người dùng hoặc email
            var user = await _context.RegisterModels.FirstOrDefaultAsync(u => u.UserName == loginModel.UserName || u.Email == loginModel.UserName);

            if (user == null || user.Password != loginModel.Password)
            {
                response.Status = false;
                response.StatusMessage = "Tên người dùng/email hoặc mật khẩu không chính xác";
                return Unauthorized(response); // Trả về mã HTTP 401 Unauthorized
            }

            // Nếu sử dụng token JWT hoặc phương pháp xác thực khác, cần tạo token tại đây
            response.Status = true;
            response.Data = user; // Hoặc token xác thực
            response.StatusMessage = "Đăng nhập thành công";
            return Ok(response); // Trả về mã HTTP 200 OK
        }


    }
}
