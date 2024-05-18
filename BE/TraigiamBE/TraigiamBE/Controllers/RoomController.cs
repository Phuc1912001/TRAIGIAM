﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly PrisonDBContext _context;

        public RoomController(PrisonDBContext context)
        {
            _context = context;
        }

        [HttpPost("AllRoom")]
        public async Task<ActionResult<IEnumerable<PunishmentModel>>> GetAllRoom(DomInfoModel domInfo)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var listBed = _context.BedModels;
                var prisoner = _context.Prisoner;
                var listPunishment = (await _context.RoomModels.Where(x => x.DomId == domInfo.DomId).Select(x => new RoomModelDto
                {
                    Id = x.Id,
                    DomId = x.DomId,
                    RoomName = x.RoomName,  
                    ListBed = listBed.Where(b => b.RoomId == x.Id).Select( b => new BedModelDto
                    {
                        Id = b.Id,
                        BedName = b.BedName,
                        PrisonerBed = prisoner.Where( p => p.DomId == x.DomId && p.RoomId == x.Id && p.BedId == b.Id ).Select(
                            p => new PrisonerModelDto
                            {
                                Id = p.Id,
                                PrisonerName = p.PrisonerName,
                                PrisonerAge = p.PrisonerAge,
                                PrisonerSex = p.PrisonerSex,
                                Cccd = p.Cccd,
                                Mpn = p.Mpn,
                                BandingID = p.BandingID,
                                DomId = p.DomId,
                                RoomId = p.RoomId,
                                BedId = p.BedId, 
                                Crime = p.Crime,
                                Years = p.Years,
                                Mananger = p.Mananger,
                                ImagePrisoner = p.ImagePrisoner,
                                ImageSrc = string.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, p.ImagePrisoner),
                                CreateAt = p.CreateAt
                            }
                            ).FirstOrDefault()
                    } ).ToList(),
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


        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateRoom(RoomModel roomModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (roomModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "roomModel model is null.";
                    return BadRequest(response);
                }

                _context.RoomModels.Add(roomModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "roomModel created successfully";
                response.Data = roomModel;
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
        public async Task<ActionResult<BaseResponseModel>> EditRoom(long id, RoomModel roomModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != roomModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(roomModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = roomModel;
                response.StatusMessage = "roomModel updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeleteRoom(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var roomModel = await _context.RoomModels.FindAsync(id);
                if (roomModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "roomModel not found";
                    return NotFound(response);
                }

                _context.RoomModels.Remove(roomModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "roomModel deleted successfully";
                response.Data = roomModel;
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