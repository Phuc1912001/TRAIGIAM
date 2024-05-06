using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatementController : ControllerBase
    {
        private readonly PrisonDBContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;


        public StatementController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StatementModel>>> GetAllStatement()
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {


                var listPrisoner = await _context.StatementModels

                    .Select(x => new StatementModel
                    {
                        Id = x.Id,
                        PrisonerId = x.PrisonerId,
                        Statement = x.Statement,
                        IrId = x.IrId,
                        ImageStatement = x.ImageStatement,
                        ImageSrc = string.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageStatement),

                    })
                    .OrderByDescending(item => item.CreateAt)
                    .ToListAsync();

                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listPrisoner;

                return Ok(response);
            }
            catch (Exception ex)
            {

                Console.Error.WriteLine($"Error fetching prisoners: {ex.Message}");

                response.Status = false;
                response.StatusMessage = "Something went wrong: " + ex.Message;
                return BadRequest(response);
            }
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateStatementModel([FromForm] StatementModel statementModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (statementModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "StatementModel  is null.";
                    return BadRequest(response);
                }

                if (ModelState.IsValid)
                {
                    if (statementModel.FileStatement != null)
                    {
                        statementModel.ImageStatement = await SaveImage(statementModel.FileStatement);
                    }

                    _context.StatementModels.Add(statementModel);
                    await _context.SaveChangesAsync();

                    response.Status = true;
                    response.StatusMessage = "StatementModel created successfully";
                    response.Data = statementModel;
                    return Ok(response);
                }
                else
                {
                    response.Status = false;
                    response.StatusMessage = "StatementModel model state";
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
        public async Task<ActionResult<BaseResponseModel>> EditStatementModel(long id, [FromForm] StatementModel statementModel)
        {
            var response = new BaseResponseModel();
            try
            {
                if (id != statementModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                if (statementModel.ImageStatement != null && statementModel.FileStatement != null)
                {
                    DeleteImage(statementModel.ImageStatement);
                    statementModel.ImageStatement = await SaveImage(statementModel.FileStatement);
                }


                var data = _context.Entry(statementModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = statementModel;
                response.StatusMessage = "ImageStatement updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeleteStatementModel(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var statementModel = await _context.StatementModels.FindAsync(id);
                if (statementModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "StatementModels not found";
                    return NotFound(response);
                }

                DeleteImage(statementModel.ImageStatement);
                _context.StatementModels.Remove(statementModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "StatementModels deleted successfully";
                response.Data = statementModel;
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
