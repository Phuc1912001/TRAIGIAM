﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Hosting;
using System.Net.WebSockets;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrisonerController : ControllerBase
    {
        private readonly PrisonDBContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;


        public PrisonerController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet("getFullList")]
        public async Task<ActionResult<IEnumerable<PrisonerModel>>> GetFullPrisoner()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listPrisoner = await _context.Prisoner.ToListAsync();
                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listPrisoner;
                return Ok(response);

            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = "Something went wrong: " + ex.Message;
                return BadRequest(response);
            }
        }

        [HttpPost("getList")]
        public async Task<ActionResult<IEnumerable<PrisonerModel>>> GetAllPrisoner(DomInfoModel infoModel)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var staff = _context.Staff;

                var test = await _context.Prisoner.ToListAsync();

                var bandings = await _context.BandingModels.ToListAsync();
                var domGender = _context.DomGenderModels;

                var listPrisoner = await _context.Prisoner
                    .Where(p => p.DomGenderId == infoModel.DomGenderId)
                    .Join(
                        staff,
                        p => p.Mananger,
                        s => s.Id,
                        (p, s) => new { p, s }
                    )
                    .Join(
                        _context.BandingModels,
                        ps => ps.p.BandingID,
                        b => b.BandingID,
                        (ps, b) => new { ps.p, ps.s, b }
                    )
                    .Select(x => new PrisonerModelDto
                    {
                        Id = x.p.Id,
                        PrisonerName = x.p.PrisonerName,
                        PrisonerAge = x.p.PrisonerAge,
                        PrisonerSex = x.p.PrisonerSex,
                        Cccd = x.p.Cccd,
                        Mpn = x.p.Mpn,
                        BandingID = x.p.BandingID,
                        IsActiveBanding = x.b.Status,
                        DomGenderId = x.p.DomGenderId,
                        DomGenderName = domGender.Where(dg => dg.Id == x.p.DomGenderId).Select(dg => dg.DomGenderName).FirstOrDefault(),

                        DomId = x.p.DomId,
                        RoomId = x.p.RoomId,
                        BedId = x.p.BedId,
                        Countryside = x.p.Countryside,
                        Crime = x.p.Crime,
                        Years = x.p.Years,
                        Mananger = x.p.Mananger,
                        ManangerName = x.s.StaffName,
                        ImagePrisoner = x.p.ImagePrisoner,
                        ImageSrc = string.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.p.ImagePrisoner),
                        CreateAt = x.p.CreateAt
                    })
                    .OrderByDescending(item => item.CreateAt)
                    .ToListAsync();

                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = listPrisoner;

                return Ok(response);
            }
            catch (Exception ex)
            {

                Console.Error.WriteLine($"Error fetching prisoners: {ex.Message}");

                response.Status = false;
                response.StatusMessage = "Something went wrong: " + ex.Message;
                return BadRequest(response);
            }
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponseModel>> GetPrisonerById(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalList = _context.ExternalModels;
                var visitList = _context.VisitModels;
                var users = _context.RegisterModels;
                var infringementList = _context.InfringementModels;
                var youthIRIds = _context.YouthIRModels;
                var statementList = _context.StatementModels;
                var staff = _context.Staff;
                var domGender = _context.DomGenderModels;
                var dom = _context.DomModels;
                var room = _context.RoomModels;
                var bed = _context.BedModels;

                var prisonerModel = await _context.Prisoner
                    .Where(x => x.Id == id)
                    .Select(x => new PrisonerModelDto
                    {
                        Id = x.Id,
                        PrisonerName = x.PrisonerName,
                        PrisonerAge = x.PrisonerAge,
                        PrisonerSex = x.PrisonerSex,
                        Cccd = x.Cccd,
                        Mpn = x.Mpn,
                        BandingID = x.BandingID,
                        DomGenderId= x.DomGenderId,
                        DomGenderName = domGender.Where(dg => dg.Id == x.DomGenderId).Select(dg => dg.DomGenderName).FirstOrDefault(),
                        DomId = x.DomId,
                        DomName = dom.Where(d => d.Id == x.DomId).Select(d => d.DomName).FirstOrDefault(),
                        RoomId = x.RoomId,
                        RoomName = room.Where(r => r.Id == x.RoomId).Select(r => r.RoomName).FirstOrDefault(),
                        BedId = x.BedId,
                        BedName = bed.Where(b => b.Id == x.BedId).Select(b => b.BedName).FirstOrDefault(),
                        Countryside = x.Countryside,
                        Crime = x.Crime,
                        Years = x.Years,
                        Mananger = x.Mananger,
                        ManangerName = staff.Where(s => s.Id == x.Mananger).Select(s => s.StaffName).FirstOrDefault(),
                        ImagePrisoner = x.ImagePrisoner,
                        ImageSrc = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{x.ImagePrisoner}",
                        ListExternal = externalList.Where(e => e.PrisonerId == id).Select(e => new ExternalModelDto
                        {
                            Id = e.Id,
                            Emtype = e.Emtype,
                            PrisonerName = x.PrisonerName,
                            EndDate = e.EndDate,
                            StartDate = e.StartDate,
                            Status = e.Status,
                            CreatedBy = e.CreatedBy,
                            CreatedByName = users.Where(u => u.Id == e.CreatedBy).Select(x => x.UserName).ToString(),
                            ModifiedBy = e.ModifiedBy,
                            ModifiedByName = users.Where(u => u.Id == e.ModifiedBy).Select(x => x.UserName).ToString(),
                        }).ToList(),
                        ListVisit = visitList.Where(v => v.PrisonerId == id).Select(v => new VisitModelDto
                        {
                            Id = v.Id,
                            PrisonerName = x.PrisonerName,
                            Desc = v.Desc,
                            StartDate = v.StartDate,
                            EndDate = v.EndDate,
                            Status = v.Status,
                            CreatedBy = v.CreatedBy,
                            CreatedByName = users.Where(u => u.Id == v.CreatedBy).Select(x => x.UserName).ToString(),
                            ModifiedBy = v.ModifiedBy,
                            ModifiedByName = users.Where(u => u.Id == v.ModifiedBy).Select(x => x.UserName).ToString(),
                            CreateAt = v.CreateAt
                        }).ToList(),
                        ListInfringement = infringementList
                           .Join(
                                youthIRIds,
                                i => i.Id,
                                y => y.InfringementID,
                                (i, y) => new { i, y })
                           .Where(iy => iy.y.YouthID == x.Id)
                           .Select(iy => new InfringementModelDto
                           {
                               Id = iy.i.Id,
                               Mvp = iy.i.Mvp,
                               NameIR = iy.i.NameIR,
                               Location = iy.i.Location,
                               TimeInfringement = iy.i.TimeInfringement,
                               ListPrisoner = youthIRIds.Where(y => y.InfringementID == iy.i.Id).Select(y => _context.Prisoner.Where(p => p.Id == y.YouthID).FirstOrDefault()).ToList(),
                               Desc = iy.i.Desc,
                               Rivise = iy.i.Rivise,
                               PunishId = iy.i.PunishId,
                               Status = iy.i.Status,
                               CreatedBy = iy.i.CreatedBy,
                               CreatedByName = users.Where(u => u.Id == iy.i.CreatedBy).Select(x => x.UserName).ToString(),
                               ModifiedBy = iy.i.ModifiedBy,
                               ModifiedByName = users.Where(u => u.Id == iy.i.ModifiedBy).Select(x => x.UserName).ToString(),
                           })
                           .ToList(),
                        ListStatement = statementList
                            .Where(s => s.PrisonerId == id)
                            .Select(s => new StatementModelDto
                            {
                                Id = s.Id,
                                PrisonerId = s.PrisonerId,
                                Statement = s.Statement,
                                IrId = s.IrId,
                                ImageStatement = s.ImageStatement,
                                TimeStatement = s.TimeStatement,
                                Status = s.Status,
                                CreatedBy = s.CreatedBy,
                                CreatedByName = users.Where(u => u.Id == s.CreatedBy).Select(x => x.UserName).ToString(),
                                ModifiedBy = s.ModifiedBy,
                                ModifiedByName = users.Where(u => u.Id == s.ModifiedBy).Select(x => x.UserName).ToString(),
                                ImageSrc = string.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, s.ImageStatement),
                            }).ToList(),
                    })
                    .FirstOrDefaultAsync();

                if (prisonerModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Prisoner not found";
                    return NotFound(response);
                }

                response.Status = true;
                response.StatusMessage = "Success";
                response.Data = prisonerModel;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = "Something went wrong";
                return BadRequest(response);
            }
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> EditPrisonerModel(long id, [FromForm] PrisonerModel prisonerModel)
        {
            var response = new BaseResponseModel();
            try
            {
                if (id != prisonerModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                if (prisonerModel.ImagePrisoner != null && prisonerModel.FilePrisoner != null)
                {
                    DeleteImage(prisonerModel.ImagePrisoner);
                    prisonerModel.ImagePrisoner = await SaveImage(prisonerModel.FilePrisoner);
                }


                var data = _context.Entry(prisonerModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await SaveLocation(prisonerModel);
                response.Status = true;
                response.Data = prisonerModel;
                response.StatusMessage = "Prisoner updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> CreatePrisonerModel([FromForm] PrisonerModel prisonerModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (prisonerModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Prisoner model is null.";
                    return BadRequest(response);
                }

                if (ModelState.IsValid)
                {
                    if (prisonerModel.FilePrisoner != null)
                    {
                        prisonerModel.ImagePrisoner = await SaveImage(prisonerModel.FilePrisoner);
                    }

                    // Thêm prisonerModel vào DbSet và lưu thay đổi để có Id
                    var prisonerEntry = _context.Prisoner.Add(prisonerModel);
                    await _context.SaveChangesAsync();

                    // Lấy lại đối tượng Prisoner sau khi đã lưu để có Id
                    var savedPrisoner = prisonerEntry.Entity;

                    // Gọi SaveLocation với Prisoner đã có Id
                    await SaveLocation(savedPrisoner);

                    response.Status = true;
                    response.StatusMessage = "Prisoner created successfully";
                    response.Data = savedPrisoner;
                    return Ok(response);
                }
                else
                {
                    response.Status = false;
                    response.StatusMessage = "Invalid model state";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }



        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponseModel>> DeletePrisonerModel(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var prisonerModel = await _context.Prisoner.FindAsync(id);
                if (prisonerModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "Prisoner not found";
                    return NotFound(response);
                }

                DeleteImage(prisonerModel.ImagePrisoner);
                _context.Prisoner.Remove(prisonerModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "Prisoner deleted successfully";
                response.Data = prisonerModel;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        [HttpPost("MoveBed")]
        public async Task<ActionResult<BaseResponseModel>> UpdateBedPrisoner(UpdateBedModel updateBedModel)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var prisoner = await _context.Prisoner.Where(p => p.Id == updateBedModel.PrisonerId).FirstOrDefaultAsync();

                var bedWithPArisoner = await _context.BedModels.Where(b => b.PrisonerId == updateBedModel.PrisonerId).FirstOrDefaultAsync();
                if (bedWithPArisoner != null)
                {
                    bedWithPArisoner.PrisonerId = null;
                }

                var bed = await _context.BedModels.Where(b => b.Id == updateBedModel.BedId).FirstOrDefaultAsync();
                if (bed != null)
                {
                    bed.PrisonerId = updateBedModel.PrisonerId;
                    await _context.SaveChangesAsync();

                }




                if (prisoner == null)
                {
                    throw new ArgumentException("prisoner is null.");

                }
                prisoner.DomGenderId = updateBedModel.DomGenderId;
                prisoner.DomId = updateBedModel.DomId;
                prisoner.RoomId = updateBedModel.RoomId;
                prisoner.BedId = updateBedModel.BedId;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "success";
                response.Data = prisoner;
                return Ok(response);

            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        [NonAction]
        public async Task SaveLocation(PrisonerModel prisonerModel)
        {
            if (prisonerModel == null || prisonerModel.Id <= 0)
            {
                throw new ArgumentException("Invalid prisoner model or prisoner ID.");
            }

            // Cập nhật BedModels
            var bedRecord = await _context.BedModels
                .FirstOrDefaultAsync(b => b.Id == prisonerModel.BedId);

            if (bedRecord != null)
            {
                bedRecord.PrisonerId = prisonerModel.Id;
            }

            // Lưu các thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();
        }




        [NonAction]
        public async Task<string> SaveImage(IFormFile FilePrisoner)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(FilePrisoner.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(FilePrisoner.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await FilePrisoner.CopyToAsync(fileStream);
            }
            return imageName;
        }

        [NonAction]
        public void DeleteImage(string imageName)
        {
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }
    }
}
