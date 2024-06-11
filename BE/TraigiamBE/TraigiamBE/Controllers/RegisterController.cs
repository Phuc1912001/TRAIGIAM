
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
 
    public class RegisterController : ControllerBase
    {
        private readonly PrisonDBContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public RegisterController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
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
                Role = registerModel.Role ?? 6 // Mặc định là 0 hoặc một giá trị khác
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


        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateUser([FromForm] RegisterModel registerModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (registerModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "registerModel model is null.";
                    return BadRequest(response);
                }

                if (ModelState.IsValid)
                {
                    if (registerModel.FileUser != null)
                    {
                        registerModel.ImageUser = await SaveImage(registerModel.FileUser);
                    }

                    _context.RegisterModels.Add(registerModel);
                    await _context.SaveChangesAsync();

                    response.Status = true;
                    response.StatusMessage = "registerModel created successfully";
                    response.Data = registerModel;
                    return Ok(response);
                }
                else
                {
                    response.Status = false;
                    response.StatusMessage = "Invalid model state";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> EditUserModel(long id, [FromForm] RegisterModel registerModel)
        {
            var response = new BaseResponseModel();
            try
            {
                if (id != registerModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                if (registerModel.ImageUser != null && registerModel.FileUser != null)
                {
                    DeleteImage(registerModel.ImageUser);
                    registerModel.ImageUser = await SaveImage(registerModel.FileUser);
                }else if(registerModel.ImageUser == null)
                {
                    registerModel.ImageUser = await SaveImage(registerModel.FileUser);

                }


                var data = _context.Entry(registerModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = registerModel;
                response.StatusMessage = "userModel updated successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponseModel>> GetUserById(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var userData = await _context.RegisterModels
                                .Where(item => item.Id == id)
                                .Select(item => new RegisterModel
                                {
                                    Id = item.Id,
                                    UserName = item.UserName,
                                    Email = item.Email,
                                    Password = item.Password,
                                    PhoneNumber = item.PhoneNumber,
                                    Role = item.Role,
                                    ImageUser = item.ImageUser,
                                    ImageSrc = item.ImageUser != null
                                                ? String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, item.ImageUser)
                                                : null,
                                }
                                ).FirstOrDefaultAsync();
                response.Status = true;
                response.Data = userData;
                response.StatusMessage = "successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }    
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponseModel>> GetAllUser()
        {
            BaseResponseModel response  = new BaseResponseModel ();
            try
            {
                var listUser = await _context.RegisterModels
                               .Select(item => new RegisterModel
                               {
                                   Id = item.Id,
                                   UserName = item.UserName,
                                   Email = item.Email,
                                   Password = item.Password,
                                   PhoneNumber = item.PhoneNumber,
                                   Role = item.Role,
                                   ImageUser = item.ImageUser,
                                   ImageSrc = item.ImageUser != null
                                                ? String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, item.ImageUser)
                                                : null,
                               }).ToListAsync();

                response.Status = true;
                response.Data = listUser;
                response.StatusMessage = "successfully";
                return Ok(response);

            }
            catch (Exception ex) {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            } 

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponseModel>> DeleteUserModel(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var registerModel = await _context.RegisterModels.FindAsync(id);
                if (registerModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "User not found";
                    return NotFound(response);
                }

                DeleteImage(registerModel.ImageUser);
                _context.RegisterModels.Remove(registerModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "User deleted successfully";
                response.Data = registerModel;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }


        [NonAction]
        public async Task<string> SaveImage(IFormFile FilePrisoner)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(FilePrisoner.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(FilePrisoner.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await FilePrisoner.CopyToAsync(fileStream);
            }
            return imageName;
        }

        [NonAction]
        public void DeleteImage(string imageName)
        {
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }


    }
}
