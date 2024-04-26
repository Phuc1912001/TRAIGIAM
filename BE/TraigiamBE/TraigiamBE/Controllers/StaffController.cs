using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly PrisonDBContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;
        public StaffController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffModel>>> GetListStaff()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listStaff = (await _context.Staff.Select(x => new StaffModel
                {
                    Id = x.Id,
                    StaffName = x.StaffName,
                    StaffAge = x.StaffAge,
                    StaffSex = x.StaffSex,
                    Cccd = x.Cccd,
                    Mnv = x.Mnv,
                    Position = x.Position,
                    Countryside = x.Countryside,
                    IsActive = x.IsActive,
                    ImageStaff = x.ImageStaff,
                    ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageStaff)
                }).ToListAsync()).OrderByDescending(item => item.CreateAt);
                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listStaff;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = "something went wrong";
                return BadRequest(response);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponseModel>> GetStaffById(int id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var staffDetail = await _context.Staff.Where(item => item.Id == id).
                    Select(x => new StaffModel
                    {
                        Id = x.Id,
                        StaffName = x.StaffName,
                        StaffAge = x.StaffAge,
                        StaffSex = x.StaffSex,
                        Cccd = x.Cccd,
                        Mnv = x.Mnv,
                        Position = x.Position,
                        Countryside = x.Countryside,
                        IsActive = x.IsActive,
                        ImageStaff = x.ImageStaff,
                        ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageStaff)
                    }).FirstOrDefaultAsync();
                if (staffDetail == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Staff not found";
                    return NotFound(response);
                }

                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = staffDetail;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = "Something went wrong";
                return BadRequest(response);
            }
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateStaffModel([FromForm] StaffModel staffModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (staffModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Staff model is null.";
                    return BadRequest(response);
                }

               

                if (staffModel.FileStaff != null)
                {
                    staffModel.ImageStaff = await SaveImage(staffModel.FileStaff);
                }

                _context.Staff.Add(staffModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Staff created successfully";
                response.Data = staffModel;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> EditStaffModel(long id, [FromForm] StaffModel staffModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != staffModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                if (staffModel.ImageStaff != null && staffModel.FileStaff != null)
                {
                    DeleteImage(staffModel.ImageStaff);
                    staffModel.ImageStaff = await SaveImage(staffModel.FileStaff);
                }


                var data = _context.Entry(staffModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = staffModel;
                response.StatusMessage = "Staff updated successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponseModel>> DeleteStaffModel(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var staffModel = await _context.Staff.FindAsync(id);
                if (staffModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Staff not found";
                    return NotFound(response);
                }

                DeleteImage(staffModel.ImageStaff);
                _context.Staff.Remove(staffModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Staff deleted successfully";
                response.Data = staffModel;
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
