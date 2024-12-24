using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PdfSharpCore.Pdf;
using PdfSharpCore;
using TheArtOfDev.HtmlRenderer.PdfSharp;
using TraigiamBE.Models;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitController : ControllerBase
    {
        private readonly PrisonDBContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly string pathImageFolder;
        public VisitController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _environment = hostEnvironment;
            pathImageFolder = Path.Combine(_environment.ContentRootPath, "Images");
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
                    FamilyName = x.FamilyName,
                    FamilyAddress = x.FamilyAddress,
                    FamilyPhone = x.FamilyPhone,
                    Desc = x.Desc,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Status = x.Status,
                    TypeVisit = x.TypeVisit,
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

        [HttpPut("{id}/cancel")]  
        public async Task<ActionResult<BaseResponseModel>> CancelVisit(long id, ConfirmModel confirmModel)
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

                visitModel.Status = 4;
                visitModel.ModifiedBy = confirmModel.UserId;

                // Bạn có thể cập nhật các trường khác nếu cần thiết
                _context.Entry(visitModel).State = EntityState.Modified;

                await _context.SaveChangesAsync(); 

                response.Status = true;
                response.StatusMessage = "Visit model confirmed successfully";
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

        [HttpPost("generatepdfVisit")]
        public async Task<IActionResult> GeneratePDF(ModelPDF modelPDF)
        {
            var prisoner = _context.Prisoner.Where(x => x.Id == modelPDF.PrisonerId).FirstOrDefault();
           
            if (prisoner == null)
            {
                return NotFound("Prisoner not found.");
            }
            var manager = _context.Staff.Where(s => s.Id == prisoner.Mananger).FirstOrDefault();
            var domGender = _context.DomGenderModels.Where(dg => dg.Id == prisoner.DomGenderId).FirstOrDefault();
            var dom = _context.DomModels.Where(dg => dg.Id == prisoner.DomId).FirstOrDefault();
            var room = _context.RoomModels.Where(r => r.Id == prisoner.RoomId).FirstOrDefault();
            var bed = _context.BedModels.Where(b => b.Id == prisoner.BedId).FirstOrDefault();



            string imagePath = Path.Combine(pathImageFolder, prisoner?.ImagePrisoner ?? "");
            string imageBase64 = "";
            if (System.IO.File.Exists(imagePath))
            {
                var template = System.IO.File.ReadAllBytes(imagePath);
                imageBase64 = Convert.ToBase64String(template);
            }


            string imageSrc = $"data:image/jpeg;base64,{imageBase64}";

            var document = new PdfDocument();
            string HtmlContent = @$"
                
                <h3 style='color: #333; font-weight: bold; text-align: center; padding: 20px; background-color: #FF9999;'>
                    Phiếu Thăm Khám
                </h3>
                <p style='font-weight: bold; margin: 10px; '>Thông tin của người thân phạm nhân:</p>
                <table style='width: 97%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Tên người thân</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Số điện thoại người thân</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Địa chỉ người thân</th>
                    </tr>
                    <tr>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{modelPDF?.FamilyName ?? "N/A"}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{modelPDF?.FamilyPhone ?? "N/A"}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{modelPDF?.FamilyAddress ?? "N/A"}</td>
                    </tr>
                </table>
                <p style='font-weight: bold;  margin: 10px;'>Thông tin của phạm nhân:</p>
              
                <table style='width: 100%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <td style='width: 5%; padding: 5px;'>
                            <img style='width:50px; height:50px; object-fit:cover' src='{imageSrc}'></img> 
                        </td>
                        <td style='width: 50%; padding: 5px;'>
                            <div style=' font-weight:900 ; margin-bottom:10px'>{prisoner.PrisonerName}</div>
                            <div>{prisoner.PrisonerAge} Tuổi</div>
                        </td>
                    </tr>
                </table>
                <table style='width: 97%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Mã Phạm Nhân</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>CCCD</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Giới Tính</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Người quản lý</th>
                    </tr>
                    <tr>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{prisoner.Mpn}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{prisoner.Cccd}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{prisoner.PrisonerSex}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{manager?.StaffName ?? "N/A"}</td>
                    </tr>
                </table>
                <p style='font-weight: bold; margin: 10px; '>Nơi ở của phạm nhân:</p>
                <table style='width: 97%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Nhà Giam</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Khu</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Phòng</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Giường</th>
                    </tr>
                    <tr>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{domGender?.DomGenderName ?? "N/A"}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{dom?.DomName ?? "N/A"}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{room?.RoomName ?? "N/A"}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{bed?.BedName ?? "N/A"}</td>
                    </tr>
                </table>
                <p style='font-weight: bold;  margin: 10px;'>Thông tin thăm khám:</p>
                <table style='width: 97%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Bắt đầu</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Kết thúc</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Loại</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Trạng Thái</th>
                    </tr>
                    <tr>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{modelPDF.StartDate?.ToString("dd-MM-yyyy HH:mm")}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{modelPDF.EndDate?.ToString("dd-MM-yyyy HH:mm")}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{GetTypeVisitDisplayName(modelPDF.TypeVisit)}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>
                            <div style='border: 1px solid #00a84e; color: #00a84e ; background-color: #f5fff9;'>Được chấp thuận</div>
                        </td>
                    </tr>
                </table>
                <div style=' margin-left: 10px;'>Lý do:<div/>
                <div style=''>{modelPDF.Desc}</div>
                <table style='width: 97%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <th style='padding: 8px; background-color: #FF9999;'>Tạo bởi:</th>
                        <th style='padding: 8px;'>{modelPDF.CreatedByName}</th>
                        <th style='padding: 8px; background-color: #FF9999;'>Chấp thuận bởi</th>
                        <th style='padding: 8px;'>{modelPDF.ModifiedByName}</th>
                    </tr>
                </table>
                ";

            PdfGenerator.AddPdfPages(document, HtmlContent, PageSize.A4);
            byte[] response;
            using (MemoryStream ms = new MemoryStream())
            {
                document.Save(ms);
                response = ms.ToArray();
            }
            string FileName = "Invoice_" + modelPDF.FileName + ".pdf";
            return File(response, "application/pdf", FileName);
        }

        private string GetTypeVisitDisplayName(int? typeVisit)
        {
            return typeVisit switch
            {
                1 => "Gặp người thân",
                2 => "Gặp Bác sĩ",
                3 => "Gặp luật sư",
                4 => "Khác",
                _=>  "Không biết"
            };
        }
    }
}
