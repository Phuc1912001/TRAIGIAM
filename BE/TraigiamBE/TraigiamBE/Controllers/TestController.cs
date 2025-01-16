using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TraigiamBE.Models;
using Microsoft.EntityFrameworkCore;

namespace TraigiamBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly PrisonDBContext _context;
        public TestController(PrisonDBContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponseModel>> CreateTest(TestModel testModel)
        {
            BaseResponseModel baseResponse = new BaseResponseModel();
            try
            {
                if (testModel == null)
                {
                    baseResponse.Status = false;
                    baseResponse.StatusMessage = "test model can not null";
                    return BadRequest(baseResponse);
                }
                _context.Add(testModel);
                await _context.SaveChangesAsync();
                baseResponse.Status = true;
                baseResponse.StatusMessage = "test được tạo thành công";
                return Ok(baseResponse);

            }
            catch (Exception ex)
            {
                baseResponse.Status = false;
                baseResponse.StatusMessage = ex.Message;
                return StatusCode(500, baseResponse);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponseModel>> UpdateTest(long id, TestModel testModel)
        {
            BaseResponseModel baseResponse = new BaseResponseModel();
            try
            {
                if (id != testModel.Id)
                {
                    baseResponse.Status = false;
                    baseResponse.StatusMessage = "Id inValid";
                    return BadRequest(baseResponse);
                }
                _context.Entry(testModel).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                baseResponse.Status = true;
                baseResponse.StatusMessage = "Updated success";
                return Ok(baseResponse);
            }
            catch (Exception ex)
            {
                baseResponse.Status = false;
                baseResponse.StatusMessage = ex.Message;
                return StatusCode(500, baseResponse);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponseModel>> DeleteTest(long id)
        {
            BaseResponseModel baseResponse = new BaseResponseModel();
            try
            {
                var curentTeslModel = await _context.TestModels.FindAsync(id);
                if (curentTeslModel == null)
                {
                    baseResponse.Status = false;
                    baseResponse.StatusMessage = "không tìm thấy record";
                    return BadRequest(baseResponse);
                }
                _context.Remove(curentTeslModel);
                await _context.SaveChangesAsync();
                baseResponse.Status = true;
                baseResponse.StatusMessage = "xóa thành công";
                return Ok(baseResponse);

            }
            catch (Exception ex)
            {
                baseResponse.Status = false;
                baseResponse.StatusMessage = ex.Message;
                return StatusCode(500, baseResponse);
            }
        }

        [HttpGet] 
        public async Task<ActionResult<TestModel>> GetAllTest ()
        {
            BaseResponseModel baseResponse = new BaseResponseModel();
            try
            {
                var listTest = await _context.TestModels.Select(x => new TestModel
                {
                    Id = x.Id,
                    TestName = x.TestName,
                    Desc = x.Desc,
                
                }).ToListAsync();

                baseResponse.Status = true;
                baseResponse.Data = listTest;
                return Ok(baseResponse);

            }catch (Exception ex)
            {
                baseResponse.Status =false;
                baseResponse.StatusMessage = ex.Message;
                return BadRequest(baseResponse);
            }
        }

    }
}
