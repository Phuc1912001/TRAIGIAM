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

                var prisoners = await _context.Prisoner.ToListAsync();
                var users = await _context.RegisterModels.ToListAsync();

                var externalModelDtos = externalModels.Select(x => new ExternalModelDto
                {
                    Id = x.Id,
                    PrisonerId = x.PrisonerId,
                    Emtype = x.Emtype,
                    Desc = x.Desc,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Status = x.Status,
                    CreatedBy = x.CreatedBy,
                    CreatedByName = users.FirstOrDefault(u => u.Id == x.CreatedBy)?.UserName,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedByName = users.FirstOrDefault( u => u.Id == x.ModifiedBy)?.UserName,
                    PrisonerName = prisoners.FirstOrDefault(p => p.Id == x.PrisonerId)?.PrisonerName,
                    CreateAt = x.CreateAt
                }).OrderByDescending(x => x.CreateAt).ToList();

                response.Status = true;
                response.Data = externalModelDtos;
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
        public async Task<ActionResult<BaseResponseModel>> EditExternalModel(long id, ExternalModel externalModel)
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
        public async Task<ActionResult<BaseResponseModel>> ConfirmExternal(long id , ConfirmModel confirmModel )
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

                // Kiểm tra nếu Status đã đạt đến mức tối đa là 3
                if (externalModel.Status > 3)
                {
                    response.Status = false;
                    response.StatusMessage = "Status cannot be increased beyond 3";
                    return BadRequest(response);  // Trả về phản hồi lỗi 400
                }

                // Nếu chưa đạt đến mức tối đa, tăng giá trị của Status
                externalModel.Status++;  // Tăng 1 cho giá trị Status
                externalModel.ModifiedBy = confirmModel.UserId;

                // Bạn có thể cập nhật các trường khác nếu cần thiết
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
