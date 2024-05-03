using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BandingController : ControllerBase
    {

        private readonly PrisonDBContext _context;

        public BandingController(PrisonDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BandingModel>>> GetAllBanding()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listBanding = (await _context.BandingModels.Select(x => new BandingModel
                {
                    Id = x.Id,
                    BandingID = x.BandingID,
                    Desc = x.Desc,
                    Status = x.Status,
                }).ToListAsync()).OrderByDescending(item => item.CreateAt);
                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listBanding;
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
        public async Task<ActionResult<BaseResponseModel>> CreateBanding(BandingModel bandingModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (bandingModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "BandingModel model is null.";
                    return BadRequest(response);
                }
                _context.BandingModels.Add(bandingModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "BandingModel created successfully";
                response.Data = bandingModel;
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
        public async Task<ActionResult<BaseResponseModel>> EditBandingModel(long id, BandingModel bandingModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != bandingModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(bandingModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = bandingModel;
                response.StatusMessage = "BandingModel updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeleteBanding(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var bandingModel = await _context.BandingModels.FindAsync(id);
                if (bandingModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Banding not found";
                    return NotFound(response);
                }

                _context.BandingModels.Remove(bandingModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Banding deleted successfully";
                response.Data = bandingModel;
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
