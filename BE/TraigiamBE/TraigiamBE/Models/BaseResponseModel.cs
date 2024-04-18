namespace TraigiamBE.Models
{
    public class BaseResponseModel
    {
        public bool Status { get; set; }
        public string StatusMessage { get; set; }

        public object Data { get; set; }
    }
}
