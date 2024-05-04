using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InfringementController : ControllerBase
    {
        private readonly PrisonDBContext _context;

        public InfringementController(PrisonDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponseModel>> GetAllInfringement()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var infingementModel = await _context.InfringementModels.ToListAsync();

                var prisoners = await _context.Prisoner.ToListAsync();
                var users = await _context.RegisterModels.ToListAsync();
                var youthIRIds = await _context.YouthIRModels.ToListAsync();


                var externalModelDtos = infingementModel.Select(x => new InfringementModelDto
                {
                    Id = x.Id,
                    Mvp = x.Mvp,
                    Desc = x.Desc,
                    TimeInfringement = x.TimeInfringement,
                    Location=x.Location,
                    PunishId=x.PunishId,
                    NameIR = x.NameIR,
                    Status = x.Status,
                    Rivise = x.Rivise,
                    CreatedBy = x.CreatedBy,
                    CreatedByName = users.FirstOrDefault(u => u.Id == x.CreatedBy)?.UserName,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedByName = users.FirstOrDefault(u => u.Id == x.ModifiedBy)?.UserName,
                    CreateAt = x.CreateAt,
                    ListPrisoner = youthIRIds.Where(y => y.InfringementID == x.Id).Select(y=> prisoners.FirstOrDefault(p => p.Id == y.YouthID)).ToList(),   
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
        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateInfringement(InfringementModel infringementModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (infringementModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "InfringementModel is null.";
                    return BadRequest(response);
                }

                // Thêm InfringementModel vào context trước
             
                 _context.InfringementModels.Add(infringementModel);
                await _context.SaveChangesAsync();
                var infingement = await _context.InfringementModels.OrderByDescending(x => x.Id).FirstOrDefaultAsync();


                // Nếu YouthIRIds có giá trị, thêm các YouthIRModel liên quan
                if (infringementModel.YouthIRIds != null)
                {
                    foreach (var item in infringementModel.YouthIRIds)
                    {
                        YouthIRModel youthIR = new YouthIRModel
                        {
                            YouthID = item,
                            InfringementID = infingement == null ? 1 : infingement.Id 
                        };
                        _context.YouthIRModels.Add(youthIR);
                        await _context.SaveChangesAsync();

                    }
                }

                // Lưu các thay đổi một lần
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Infringement created successfully";
                response.Data = infringementModel;
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
        public async Task<ActionResult<BaseResponseModel>> DeleteInfringement(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var infringementModel = await _context.InfringementModels.FindAsync(id);
                var youthIR = await _context.YouthIRModels.Where( x => x.InfringementID == id).ToListAsync();
                if (infringementModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Infringement not found";
                    return NotFound(response);
                }
                if (youthIR == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Infringement not found";
                    return NotFound(response);
                }

                _context.InfringementModels.Remove(infringementModel);
                _context.YouthIRModels.RemoveRange(youthIR);

                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Infringement deleted successfully";
                response.Data = infringementModel;
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
