using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DomController : ControllerBase
    {
        private readonly PrisonDBContext _context;

        public DomController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
        }

        [HttpPost("AllDom")]
        public async Task<ActionResult<IEnumerable<PunishmentModel>>> GetAllDom(DomInfoModel domInfo)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listDomGender =  _context.DomGenderModels;

                if (listDomGender == null)
                {
                    throw new Exception();
                }
                
                var listPunishment = (await _context.DomModels.Where(x => x.DomGenderId == domInfo.DomGenderId).Select(x => new DomModelDto
                {
                    Id = x.Id,
                    DomName = x.DomName,
                    DomGenderId = x.DomGenderId,  
                    DomGenderName = listDomGender.Where(l => l.Id == domInfo.DomGenderId).Select(x => x.DomGenderName).FirstOrDefault()
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

        //[HttpGet("id")]
        //public async Task<ActionResult<BaseResponseModel>> GetDetailById(int id)
        //{
        //    BaseResponseModel response = new BaseResponseModel();
        //    try
        //    {
        //        var externalModel = await _context.ExternalModels.FindAsync(id);
        //        if (externalModel == null)
        //        {
        //            response.Status = false;
        //            response.StatusMessage = "External model not found";
        //            return NotFound(response);
        //        }

        //        response.Status = true;
        //        response.StatusMessage = "Successfully retrieved External model by ID";
        //        response.Data = externalModel;
        //        return Ok(response);
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Status = false;
        //        response.StatusMessage = $"Internal server error: {ex.Message}";
        //        return StatusCode(500, response);
        //    }
        //}
        [HttpPost("limitDom")]
        public async Task<ActionResult<IEnumerable<DomModelDto>>> GetLimitDom(DomInfoModel domInfo)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var checkBed = await _context.BedModels.Where(b => b.DomGenderId == domInfo.DomGenderId && b.PrisonerId == null).ToListAsync();

                if (checkBed == null || checkBed.Count == 0)
                {
                    response.Status = false;
                    response.StatusMessage = "Khu đã đầy";
                    return Ok(response);
                }

                List<DomModel> listDom = new List<DomModel>();

                foreach (var bed in checkBed)
                {
                    var dom = await _context.DomModels.FirstOrDefaultAsync(d => d.Id == bed.DomId);
                    if (dom != null)
                    {
                        listDom.Add(dom);
                    }
                }

                var listDomDistinct = listDom.Distinct().ToList();

                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listDomDistinct;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = "Something went wrong";
                return BadRequest(response);
            }
        }


        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateDom(DomModel domModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (domModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "domModel model is null.";
                    return BadRequest(response);
                }

                _context.DomModels.Add(domModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "domModel created successfully";
                response.Data = domModel;
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
        public async Task<ActionResult<BaseResponseModel>> EditDom(long id, DomModel domModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != domModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(domModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = domModel;
                response.StatusMessage = "domModel updated successfully";
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
                var domModel = await _context.DomModels.FindAsync(id);
                if (domModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "domModel not found";
                    return NotFound(response);
                }

                _context.DomModels.Remove(domModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "domModel deleted successfully";
                response.Data = domModel;
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
