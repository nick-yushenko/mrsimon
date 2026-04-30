using Microsoft.AspNetCore.Mvc;

namespace MrSimon.Api.Controllers;

[ApiController]
[Route("api/system")]
public class SystemController : ControllerBase
{
    [HttpGet("info")]
    public IActionResult GetInfo()
    {
        return Ok(
            new
            {
                app = "MrSimon",
                module = "api",
                status = "running",
            }
        );
    }
}
