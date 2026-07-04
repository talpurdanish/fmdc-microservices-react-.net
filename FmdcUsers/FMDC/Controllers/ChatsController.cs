
using Domain.Helpers;
using Microsoft.AspNetCore.Mvc;
using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;

namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    public class ChatsController : ControllerBase, IDisposable
    {

        private readonly string? _apiKey;
        private readonly Google.GenAI.Client _client;

        public ChatsController(IConfiguration config)
        {
            _apiKey = config["Google:ApiKey"];
            if (string.IsNullOrEmpty(_apiKey))
            {
                throw new InvalidOperationException("OpenAI API key not found in configuration.");
            }

            _client = new Google.GenAI.Client(apiKey: _apiKey);

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Google([FromBody] ChatRequest chat)
        {
            try
            {
                var reply = "";

                string modelId = "gemini-3-flash-preview";

                if (chat.IsMScc)
                {
                    var prompt = chat.Message;
                    var googleAi = new GoogleAI(_apiKey);
                    var model = googleAi.GenerativeModel(Model.Gemini3FlashPreview);
                    var generationConfig = chat.Message.Contains("recipe", StringComparison.CurrentCultureIgnoreCase) ? new GenerationConfig()
                    {
                        ResponseMimeType = "application/json",
                        ResponseSchema = Schema.FromType<List<Recipe>>()
                    } : new GenerationConfig()
                    {
                        ResponseMimeType = "application/json",
                    };

                    var response = await model.GenerateContent(prompt,
                        generationConfig: generationConfig);
                    
                    reply = response is null? "Sorry, response could not be generated" : response!.Text;
                }
                else
                {
                    var response = await _client.Models.GenerateContentAsync(
                        model: modelId, contents: chat.Message
                    );

                    if (response is null || response.Candidates is null || response.Candidates[0] is null || response.Candidates[0].Content is null)
                    {

                        reply = "Sorry, response could not be generated";
                    }
                    else if (response.Candidates[0].Content is not null && response.Candidates[0].Content!.Parts is null)
                    {
                        reply = "Sorry, response could not be generated";
                    }
                    else
                    {
                        reply = response.Candidates[0].Content!.Parts![0].Text;
                    }
                }

                var replyChat = new ChatRequest
                {
                    Message = reply!,

                };
                return FmdcResult.Success(replyChat, 200);
            }
            catch (Exception e)
            {
                return FmdcResult.Error(e.Message.Substring(0, 100), 500);
            }
        }

        public void Dispose()
        {
            _client.Dispose();
            GC.SuppressFinalize(this);
        }
    }
    // Define the types
    public class Recipe
    {
        public required string RecipeName { get; set; }
        public List<Ingredient> Ingredients { get; set; } = [];
    }

    public class Ingredient
    {
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Unit { get; set; }= string.Empty;
    }
    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
        public bool IsMScc { get; set; } = true;
    }

}
