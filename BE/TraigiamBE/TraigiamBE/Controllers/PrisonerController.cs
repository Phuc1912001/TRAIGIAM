using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrisonerController : ControllerBase
    {
        private readonly PrisonDBContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;


        public PrisonerController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrisonerModel>>> GetAllPrisoner()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listPrisoner = (await _context.Prisoner
                .Select(x => new PrisonerModel
                {
                    Id = x.Id,
                    PrisonerName = x.PrisonerName,
                    PrisonerAge = x.PrisonerAge,
                    PrisonerSex = x.PrisonerSex,
                    Cccd = x.Cccd,
                    Mpn = x.Mpn,
                    Banding = x.Banding,
                    Dom = x.Dom,
                    Bed = x.Bed,
                    Countryside = x.Countryside,
                    Crime = x.Crime,
                    Years = x.Years,
                    Mananger = x.Mananger,
                    ImagePrisoner = x.ImagePrisoner,
                    ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImagePrisoner)
                }).ToListAsync()).OrderByDescending(item => item.CreateAt);

                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listPrisoner;
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
        public async Task<ActionResult<BaseResponseModel>> GetPrisonerById(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var prisonerModel = await _context.Prisoner
                    .Where(x => x.Id == id)
                    .Select(x => new PrisonerModel
                    {
                        Id = x.Id,
                        PrisonerName = x.PrisonerName,
                        PrisonerAge = x.PrisonerAge,
                        PrisonerSex = x.PrisonerSex,
                        Cccd = x.Cccd,
                        Mpn = x.Mpn,
                        Banding = x.Banding,
                        Dom = x.Dom,
                        Bed = x.Bed,
                        Countryside = x.Countryside,
                        Crime = x.Crime,
                        Years = x.Years,
                        Mananger = x.Mananger,
                        ImagePrisoner = x.ImagePrisoner,
                        ImageSrc = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{x.ImagePrisoner}"
                    })
                    .FirstOrDefaultAsync();

                if (prisonerModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Prisoner not found";
                    return NotFound(response);
                }

                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = prisonerModel;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = "Something went wrong";
                return BadRequest(response);
            }
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> EditPrisonerModel(long id, [FromForm] PrisonerModel prisonerModel)
        {
            var response = new BaseResponseModel();
            try
            {
                if (id != prisonerModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                if (prisonerModel.ImagePrisoner != null && prisonerModel.FilePrisoner != null)
                {
                    DeleteImage(prisonerModel.ImagePrisoner);
                    prisonerModel.ImagePrisoner = await SaveImage(prisonerModel.FilePrisoner);
                }
               

                var data = _context.Entry(prisonerModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = prisonerModel;
                response.StatusMessage = "Prisoner updated successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }


        private bool EmployeeModelExists(int id)
        {
            return _context.Prisoner.Any(e => e.Id == id);
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreatePrisonerModel([FromForm] PrisonerModel employeeModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (employeeModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Employee model is null.";
                    return BadRequest(response);
                }

                if (ModelState.IsValid)
                {
                    if (employeeModel.FilePrisoner != null  )
                    {
                        employeeModel.ImagePrisoner = await SaveImage(employeeModel.FilePrisoner);
                    }

                    _context.Prisoner.Add(employeeModel);
                    await _context.SaveChangesAsync();

                    response.Status = true;
                    response.StatusMessage = "Prisoner created successfully";
                    response.Data = employeeModel;
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


        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponseModel>> DeletePrisonerModel(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var prisonerModel = await _context.Prisoner.FindAsync(id);
                if (prisonerModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Prisoner not found";
                    return NotFound(response);
                }

                DeleteImage(prisonerModel.ImagePrisoner);
                _context.Prisoner.Remove(prisonerModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Prisoner deleted successfully";
                response.Data = prisonerModel;
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
