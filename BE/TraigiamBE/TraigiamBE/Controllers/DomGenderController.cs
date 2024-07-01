using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomGenderController : ControllerBase
    {
        private readonly PrisonDBContext _context;

        public DomGenderController(PrisonDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DomGenderModel>>> GetAllDom()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listDomGender = (await _context.DomGenderModels.Select(x => new DomGenderModel
                {
                    Id = x.Id,
                    DomGenderName = x.DomGenderName
                }).ToListAsync()).OrderByDescending(item => item.CreateAt);
                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listDomGender;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = "something went wrong";
                return BadRequest(response);
            }
        }


        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateDom(DomGenderModel domGenderModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (domGenderModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "domGenderModel model is null.";
                    return BadRequest(response);
                }

                _context.DomGenderModels.Add(domGenderModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "domGenderModel created successfully";
                response.Data = domGenderModel;
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
        public async Task<ActionResult<BaseResponseModel>> EditDom(long id, DomGenderModel domGenderModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != domGenderModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(domGenderModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = domGenderModel;
                response.StatusMessage = "domGenderModel updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeleteDom(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var domGenderModel = await _context.DomGenderModels.FindAsync(id);
                if (domGenderModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "domGenderModel not found";
                    return NotFound(response);
                }

                _context.DomGenderModels.Remove(domGenderModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "domModel deleted successfully";
                response.Data = domGenderModel;
                return Ok(response);

            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }
    }
}
