using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExternalController : ControllerBase
    {
        private readonly PrisonDBContext _context;

        public ExternalController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponseModel>> GetAllExternal()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalModels = await _context.ExternalModels.ToListAsync();
                response.Status = true;
                response.Data = externalModels;
                response.StatusMessage = "Successfully retrieved all External models";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        [HttpGet("id")]
        public async Task<ActionResult<BaseResponseModel>> GetDetailById (int id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalModel = await _context.ExternalModels.FindAsync(id);
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "External model not found";
                    return NotFound(response);
                }

                response.Status = true;
                response.StatusMessage = "Successfully retrieved External model by ID";
                response.Data = externalModel;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }


        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateExternal( ExternalModel externalModel )
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "External model is null.";
                    return BadRequest(response);
                }
                _context.ExternalModels.Add(externalModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "External created successfully";
                response.Data = externalModel;
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
        public async Task<ActionResult<BaseResponseModel>> EditExternalModel(long id, PunishmentModel externalModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != externalModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(externalModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = externalModel;
                response.StatusMessage = "External updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeleteExternal(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalModel = await _context.ExternalModels.FindAsync(id);
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "External not found";
                    return NotFound(response);
                }

                _context.ExternalModels.Remove(externalModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "External deleted successfully";
                response.Data = externalModel;
                return Ok(response);

            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }
        [HttpPut("{id}/confirm")]  // Endpoint cho hành động xác nhận
        public async Task<ActionResult<BaseResponseModel>> ConfirmExternal(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                // Tìm đối tượng ExternalModel theo ID
                var externalModel = await _context.ExternalModels.FindAsync(id);
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "External model not found";
                    return NotFound(response);
                }

                // Cập nhật trạng thái thành 1
                externalModel.Status = 1;
                //externalModel.ModifiedBy = 0;  
                //externalModel.ModifiedByName = "Confirmed";  
                _context.Entry(externalModel).State = EntityState.Modified;

                await _context.SaveChangesAsync();  // Lưu thay đổi vào cơ sở dữ liệu

                response.Status = true;
                response.StatusMessage = "External model confirmed successfully";
                response.Data = externalModel;  // Trả về đối tượng đã xác nhận
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
