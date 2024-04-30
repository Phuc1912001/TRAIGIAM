using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PunishController : ControllerBase
    {
        private readonly PrisonDBContext _context;

        public PunishController(PrisonDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PunishmentModel>>> GetAllPunishment()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listPunishment = (await _context.Punishment.Select(x => new PunishmentModel
                {
                    Id = x.Id,
                    PunishName = x.PunishName,
                    Desc = x.Desc,
                    Status = x.Status,
                }).ToListAsync()).OrderByDescending(item => item.CreateAt);
                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listPunishment;
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
        public async Task<ActionResult<BaseResponseModel>> CreatePunish(PunishmentModel punishModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (punishModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "PunishModel model is null.";
                    return BadRequest(response);
                }
                _context.Punishment.Add(punishModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Punishment created successfully";
                response.Data = punishModel;
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
        public async Task<ActionResult<BaseResponseModel>> EditPunishModel(long id, PunishmentModel punishmentModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != punishmentModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(punishmentModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = punishmentModel;
                response.StatusMessage = "Punishment updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeletePunishment(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var punishModel = await _context.Punishment.FindAsync(id);
                if(punishModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Punish not found";
                    return NotFound(response);
                }

                _context.Punishment.Remove(punishModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Punishment deleted successfully";
                response.Data = punishModel;
                return Ok(response);

            }catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }
    }
}
