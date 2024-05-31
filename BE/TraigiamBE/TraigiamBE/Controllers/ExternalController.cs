using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TraigiamBE.Models;
using PdfSharpCore;
using PdfSharpCore.Pdf;
using TheArtOfDev.HtmlRenderer.PdfSharp;

using System.IO;
using System.Threading.Tasks;



namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExternalController : ControllerBase
    {
        private readonly PrisonDBContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly string pathImageFolder;
        public ExternalController(PrisonDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _environment= hostEnvironment;
            pathImageFolder = Path.Combine(_environment.ContentRootPath, "Images");
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponseModel>> GetAllExternal()
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalModels = await _context.ExternalModels.ToListAsync();

                var prisoners = await _context.Prisoner.ToListAsync();
                var users = await _context.RegisterModels.ToListAsync();

                var externalModelDtos = externalModels.Select(x => new ExternalModelDto
                {
                    Id = x.Id,
                    PrisonerId = x.PrisonerId,
                    Emtype = x.Emtype,
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
                response.StatusMessage = "Successfully retrieved all External models";
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
                var externalModel = await _context.ExternalModels.FindAsync(id);
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "External model not found";
                    return NotFound(response);
                }

                response.Status = true;
                response.StatusMessage = "Successfully retrieved External model by ID";
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
        public async Task<ActionResult<BaseResponseModel>> CreateExternal(ExternalModel externalModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "External model is null.";
                    return BadRequest(response);
                }

                _context.ExternalModels.Add(externalModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "External created successfully";
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

        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> EditExternalModel(long id, ExternalModel externalModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (id != externalModel.Id)
                    return BadRequest(new BaseResponseModel { Status = false, StatusMessage = "Invalid ID" });

                var data = _context.Entry(externalModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                response.Status = true;
                response.Data = externalModel;
                response.StatusMessage = "External updated successfully";
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
        public async Task<ActionResult<BaseResponseModel>> DeleteExternal(long id)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                var externalModel = await _context.ExternalModels.FindAsync(id);
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "External not found";
                    return NotFound(response);
                }

                _context.ExternalModels.Remove(externalModel);
                await _context.SaveChangesAsync();

                response.Status = true;
                response.StatusMessage = "External deleted successfully";
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
        public async Task<ActionResult<BaseResponseModel>> ConfirmExternal(long id, ConfirmModel confirmModel)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                // Tìm đối tượng ExternalModel theo ID
                var externalModel = await _context.ExternalModels.FindAsync(id);
                if (externalModel == null)
                {
                    response.Status = false;
                    response.StatusMessage = "External model not found";
                    return NotFound(response);
                }

                // Kiểm tra nếu Status đã đạt đến mức tối đa là 3
                if (externalModel.Status > 3)
                {
                    response.Status = false;
                    response.StatusMessage = "Status cannot be increased beyond 3";
                    return BadRequest(response);  // Trả về phản hồi lỗi 400
                }

                // Nếu chưa đạt đến mức tối đa, tăng giá trị của Status
                externalModel.Status++;  // Tăng 1 cho giá trị Status
                externalModel.ModifiedBy = confirmModel.UserId;

                // Bạn có thể cập nhật các trường khác nếu cần thiết
                _context.Entry(externalModel).State = EntityState.Modified;

                await _context.SaveChangesAsync();  // Lưu thay đổi vào cơ sở dữ liệu

                response.Status = true;
                response.StatusMessage = "External model confirmed successfully";
                response.Data = externalModel;  // Trả về đối tượng đã xác nhận
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.StatusMessage = $"Internal server error: {ex.Message}";
                return StatusCode(500, response);
            }
        }

        [HttpPost("generatepdfExternal")]
        public async Task<IActionResult> GeneratePDF(ExternalPDFModel externalPDFModel)
        {
            var prisoner = _context.Prisoner.Where(x => x.Id == externalPDFModel.PrisonerId).FirstOrDefault();
            //if(prisoner == null)
            //{
            //    throw new Exception();
            //}
            if (prisoner == null)
            {
                return NotFound("Prisoner not found.");
            }
            var manager = _context.Staff.Where(s => s.Id == prisoner.Mananger).FirstOrDefault();
            var domGender = _context.DomGenderModels.Where(dg=> dg.Id == prisoner.DomGenderId).FirstOrDefault();
            var dom = _context.DomModels.Where(dg=> dg.Id == prisoner.DomId).FirstOrDefault();
            var room = _context.RoomModels.Where(r=> r.Id == prisoner.RoomId).FirstOrDefault();
            var bed = _context.BedModels.Where(b=> b.Id == prisoner.BedId).FirstOrDefault();
          


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
                    Phiếu Ra Vào Trại Giam
                </h3>
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
                <p style='font-weight: bold;  margin: 10px;'>Nơi ở của phạm nhân:</p>
                <table style='width: 97%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Nhà Giam</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Khu</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Phòng</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Giường</th>
                    </tr>
                    <tr>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{domGender?.DomGenderName ?? "N/A"}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{dom?.DomName ?? "N/A" }</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{room?.RoomName ?? "N/A"}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{bed?.BedName ?? "N/A"}</td>
                    </tr>
                </table>
                <p style='font-weight: bold;  margin: 10px;'>Thông tin ra vào trại giam:</p>
                <table style='width: 97%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Bắt đầu</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Kết thúc</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Loại</th>
                        <th style='border: 1px solid #333; padding: 8px; background-color: #FF9999;'>Trạng Thái</th>
                    </tr>
                    <tr>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{externalPDFModel.StartDate?.ToString("dd-MM-yyyy HH:mm")}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{externalPDFModel.EndDate?.ToString("dd-MM-yyyy HH:mm")}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>{GetTypeEMDisplayName(externalPDFModel.Emtype)}</td>
                        <td style='border: 1px solid #333; padding: 8px; text-align:center;'>
                            <div style='border: 1px solid #00a84e; color: #00a84e ; background-color: #f5fff9;'>Được chấp thuận</div>
                        </td>
                    </tr>
                </table>
                <div style=' margin-left: 10px;'>Lý do:<div/>
                <div style=''>{externalPDFModel.Desc}</div>
                <table style='width: 97%; border-collapse: collapse; margin: 10px;'>
                    <tr>
                        <th style='padding: 8px; background-color: #FF9999;'>Tạo bởi:</th>
                        <th style='padding: 8px;'>{externalPDFModel.CreatedByName}</th>
                        <th style='padding: 8px; background-color: #FF9999;'>Chấp thuận bởi</th>
                        <th style='padding: 8px;'>{externalPDFModel.ModifiedByName}</th>
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
            string FileName = "Invoice_" + externalPDFModel.FileName + ".pdf";
            return File(response, "application/pdf", FileName);
        }

        private string GetTypeEMDisplayName(int? typeVisit)
        {
            return typeVisit switch
            {
                1 => "Nhập Viện",
                2 => "Ra Tòa",
                3 => "Đi Điều Tra",
                _ => "Không biết"
            };
        }



    }
}
