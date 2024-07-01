using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BedController : ControllerBase
    {
        private readonly PrisonDBContext _context;

        public BedController(PrisonDBContext context)
        {
            _context = context;
        }

        [HttpPost("AllBed")]
        public async Task<ActionResult<IEnumerable<DomInfoModel>>> GetAllBed(DomInfoModel domInfo )
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var prisoner = _context.Prisoner;
                var listPunishment = (await _context.BedModels.Where(x => x.DomId == domInfo.DomId && x.RoomId == domInfo.RoomId && x.DomGenderId == domInfo.DomGenderId)
                    .Select(x => new BedModelDto
                    {
                        Id = x.Id,
                        DomId = x.DomId,
                        BedName = x.BedName,
                        RoomId = x.RoomId,
                        
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

        [HttpPost("LimitBed")]
        public async Task<ActionResult<IEnumerable<DomInfoModel>>> GetLimitBed(DomInfoModel domInfo)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var checkBed = await _context.BedModels.Where(b => b.DomGenderId == domInfo.DomGenderId && b.DomId == domInfo.DomId && b.RoomId == domInfo.RoomId && b.PrisonerId == null).ToListAsync();
                if (checkBed == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Phòng đã đầy";
                    return Ok(response);
                }

                List<BedModel> listBed = new List<BedModel>();

                foreach (var bed in checkBed)
                {
                    var recordBed = await _context.BedModels.FirstOrDefaultAsync(d => d.Id == bed.Id);

                    if (recordBed != null)
                    {
                        listBed.Add(recordBed);
                    };
                }

                var listBedDistinct = listBed.Distinct().ToList();  
                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listBedDistinct;
                return Ok(response);
            }
            catch (Exception ex)
            { 
                response.Status = false;
                response.StatusMessage = "something went wrong";
                return BadRequest(response);
            }
        }


        [HttpPost("LimitBedEdit")]
        public async Task<ActionResult<IEnumerable<BedModel>>> GetLimitBedEdit(DomInfoModel domInfo)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var checkBed = await _context.BedModels.Where(b => b.DomGenderId == domInfo.DomGenderId && b.DomId == domInfo.DomId && b.RoomId == domInfo.RoomId).ToListAsync();
                if (checkBed == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Phòng đã đầy";
                    return Ok(response);
                }

               

                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = checkBed;
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
        public async Task<ActionResult<BaseResponseModel>> CreateBed(BedModel bedModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (bedModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "bedModel model is null.";
                    return BadRequest(response);
                }

                _context.BedModels.Add(bedModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "bedModel created successfully";
                response.Data = bedModel;
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
        public async Task<ActionResult<BaseResponseModel>> EditBed(long id, BedModel bedModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != bedModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(bedModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = bedModel;
                response.StatusMessage = "bedModel updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeleteBed(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var bedModel = await _context.BedModels.FindAsync(id);
                if (bedModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "bedModel not found";
                    return NotFound(response);
                }

                _context.BedModels.Remove(bedModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "bedModel deleted successfully";
                response.Data = bedModel;
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
