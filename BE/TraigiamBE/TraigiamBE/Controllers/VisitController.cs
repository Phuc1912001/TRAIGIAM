using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitController : ControllerBase
    {
        private readonly PrisonDBContext _context;

        public VisitController(PrisonDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponseModel>> GetAllVisit()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalModels = await _context.VisitModels.ToListAsync();

                var prisoners = await _context.Prisoner.ToListAsync();
                var users = await _context.RegisterModels.ToListAsync();

                var externalModelDtos = externalModels.Select(x => new VisitModelDto
                {
                    Id = x.Id,
                    PrisonerId = x.PrisonerId,
                    Desc = x.Desc,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Status = x.Status,
                    CreatedBy = x.CreatedBy,
                    CreatedByName = users.FirstOrDefault(u => u.Id == x.CreatedBy)?.UserName,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedByName = users.FirstOrDefault(u => u.Id == x.ModifiedBy)?.UserName,
                    PrisonerName = prisoners.FirstOrDefault(p => p.Id == x.PrisonerId)?.PrisonerName,
                    CreateAt = x.CreateAt
                }).OrderByDescending(x => x.CreateAt).ToList();

                response.Status = true;
                response.Data = externalModelDtos;
                response.StatusMessage = "Successfully retrieved all Visit models";
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
        public async Task<ActionResult<BaseResponseModel>> GetDetailById(int id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalModel = await _context.VisitModels.FindAsync(id);
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Visit model not found";
                    return NotFound(response);
                }

                response.Status = true;
                response.StatusMessage = "Successfully retrieved Visit model by ID";
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
        public async Task<ActionResult<BaseResponseModel>> CreateVisit(VisitModel visitModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (visitModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "VisitModel model is null.";
                    return BadRequest(response);
                }

                _context.VisitModels.Add(visitModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "VisitModel created successfully";
                response.Data = visitModel;
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
        public async Task<ActionResult<BaseResponseModel>> EditVisitModel(long id, VisitModel visitModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != visitModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(visitModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = visitModel;
                response.StatusMessage = "Visit updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeleteVisit(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalModel = await _context.VisitModels.FindAsync(id);
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Visit not found";
                    return NotFound(response);
                }

                _context.VisitModels.Remove(externalModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Visit deleted successfully";
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
        public async Task<ActionResult<BaseResponseModel>> ConfirmVisit(long id, ConfirmModel confirmModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                // Tìm đối tượng ExternalModel theo ID
                var visitModel = await _context.VisitModels.FindAsync(id);
                if (visitModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Visit model not found";
                    return NotFound(response);
                }

                // Kiểm tra nếu Status đã đạt đến mức tối đa là 3
                if (visitModel.Status > 2)
                {
                    response.Status = false;
                    response.StatusMessage = "Status cannot be increased beyond 3";
                    return BadRequest(response);  // Trả về phản hồi lỗi 400
                }

                // Nếu chưa đạt đến mức tối đa, tăng giá trị của Status
                visitModel.Status++;  // Tăng 1 cho giá trị Status
                visitModel.ModifiedBy = confirmModel.UserId;

                // Bạn có thể cập nhật các trường khác nếu cần thiết
                _context.Entry(visitModel).State = EntityState.Modified;

                await _context.SaveChangesAsync();  // Lưu thay đổi vào cơ sở dữ liệu

                response.Status = true;
                response.StatusMessage = "Visit model confirmed successfully";
                response.Data = visitModel;  // Trả về đối tượng đã xác nhận
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
