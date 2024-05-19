using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;
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

        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponseModel>> GetDetailById( long id )
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var users =  _context.RegisterModels;
                var prisoner = _context.Prisoner;
                var youthIRIds = _context.YouthIRModels;
                var statement =  _context.StatementModels;
                var punishment = _context.Punishment;

                var infringementModel = await _context.InfringementModels
                    .Select(x => new InfringementModelDto
                    {
                        Id = x.Id,
                        Mvp = x.Mvp,
                        Desc = x.Desc,
                        TimeInfringement = x.TimeInfringement,
                        Location = x.Location,
                        PunishId = x.PunishId,
                        PunishName = punishment.Where(p=> p.Id == x.PunishId).Select(a => a.PunishName).FirstOrDefault(),
                        NameIR = x.NameIR,
                        Status = x.Status,
                        Rivise = x.Rivise,
                        CreatedBy = x.CreatedBy,
                        CreatedByName = users.Where(u => u.Id == x.CreatedBy).Select(a => a.UserName).FirstOrDefault(),
                        ModifiedBy = x.ModifiedBy,
                        ModifiedByName = users.Where(u => u.Id == x.ModifiedBy).Select(a => a.UserName).FirstOrDefault(),
                        ListPrisonerStatement = prisoner.Join(youthIRIds , p => p.Id , y => y.YouthID , (p,y) => new {p,y} ).Where(py => py.y.InfringementID == id ).Select(
                             item => new PrisonerModelDto
                            {
                                Id= item.p.Id,
                                PrisonerName = item.p.PrisonerName,
                                PrisonerAge = item.p.PrisonerAge,
                                BandingID = item.p.BandingID,
                                ImageSrc = string.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, item.p.ImagePrisoner),
                                ListStatement =  statement.Where( s => s.IrId == id && s.PrisonerId == item.p.Id).Select(state => new StatementModelDto
                                {
                                    Id = state.Id,
                                    PrisonerId = state.PrisonerId,
                                    PrisonerName = item.p.PrisonerName,
                                    Status = state.Status,
                                    IrId = state.IrId,
                                    IRName = x.NameIR,
                                    TimeStatement = state.TimeStatement,
                                    Statement = state.Statement,
                                    CreatedBy = state.CreatedBy,
                                    CreatedByName = users.Where(u => u.Id == state.CreatedBy).Select(a => a.UserName).FirstOrDefault(),
                                    ModifiedBy = state.ModifiedBy,
                                    ModifiedByName = users.Where(u => u.Id == state.ModifiedBy).Select(a => a.UserName).FirstOrDefault(),
                                    ImageStatement = state.ImageStatement,
                                    ImageSrc = string.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, state.ImageStatement) }).ToList()
                            }).ToList(),
                    }).FirstOrDefaultAsync();

                response.Status = true;
                response.Data = infringementModel;
                response.StatusMessage = "Successfully retrieved all Visit models";
                return Ok(response);

            }
            catch(Exception ex)
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

        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> UpdateInfringement(long id, InfringementModel infringementModel)
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

                // Tìm InfringementModel theo ID
                var existingInfringement = await _context.InfringementModels.FindAsync(id);

                if (existingInfringement == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Infringement not found.";
                    return NotFound(response);
                }

                // Cập nhật thuộc tính của InfringementModel hiện tại
                existingInfringement.Mvp = infringementModel.Mvp;  // Thay đổi theo yêu cầu của bạn
                existingInfringement.NameIR = infringementModel.NameIR;
                existingInfringement.Location = infringementModel.Location;
                existingInfringement.Rivise = infringementModel.Rivise;
                existingInfringement.PunishId = infringementModel.PunishId;
                existingInfringement.TimeInfringement = infringementModel.TimeInfringement;
                existingInfringement.Desc = infringementModel.Desc;
                
                // Cập nhật các thuộc tính khác...                                                                                         

                // Lưu các thay đổi một lần
                await _context.SaveChangesAsync();

                var infingement = await _context.InfringementModels.OrderByDescending(x => x.Id).FirstOrDefaultAsync();


                // Cập nhật các YouthIR liên quan
                if (infringementModel.YouthIRIds != null)
                {
                    // Xóa tất cả các YouthIR hiện có để đảm bảo chỉ giữ các liên kết mới
                    var existingYouthIRs = _context.YouthIRModels
                        .Where(y => y.InfringementID == id);

                    _context.YouthIRModels.RemoveRange(existingYouthIRs);

                    // Thêm các liên kết mới
                    foreach (var item in infringementModel.YouthIRIds)
                    {
                        YouthIRModel newYouthIR = new YouthIRModel
                        {
                            YouthID = item,
                            InfringementID = id
                        };
                        _context.YouthIRModels.Add(newYouthIR);
                    }

                    // Lưu thay đổi
                    await _context.SaveChangesAsync();
                }

                response.Status = true;
                response.StatusMessage = "Infringement updated successfully.";
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
        [HttpGet("getIRByPrisoner/{prisonerId}")]
        public async Task<ActionResult<BaseResponseModel>> GetIRByPrisoner(long prisonerId)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listInfingementByPrisoner = (await _context.InfringementModels
                    .Join(
                        _context.YouthIRModels,
                        i => i.Id,
                        y => y.InfringementID,
                        (i, y) => new { i, y }
                    )
                    .Join(
                        _context.Prisoner,
                        iy => iy.y.YouthID,
                        p => p.Id,
                        (iy, p) => new { iy, p, iy.i, iy.y }
                    )
                    .Where(x => x.y.YouthID == prisonerId)
                    .Select(x => new InfringementModel
                    {
                        Id = x.i.Id,
                        NameIR = x.i.NameIR
                    })
                    .ToListAsync())
                    .OrderByDescending(x => x.CreateAt);

                response.Status = true;
                response.Data = listInfingementByPrisoner;
                response.StatusMessage = "Successfully retrieved all Visit models";
                return Ok(response);
            }
            catch (Exception ex) {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        [HttpGet("getPrisonerByIR")]
        public async Task<ActionResult<BaseResponseModel>> GetPrisonerByIR()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listPrisoner = (await _context.YouthIRModels
                    .Join(
                        _context.Prisoner,
                        y => y.YouthID,
                        p => p.Id,
                        (y, p) => new { y, p }
                    )
                    .Select(x => new PrisonerModel
                    {
                        Id = x.p.Id,
                        PrisonerName = x.p.PrisonerName
                    })
                    .Distinct()
                    .ToListAsync())
                    .OrderByDescending(x => x.CreateAt);

                response.Status = true;
                response.Data = listPrisoner;
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

    }
}
