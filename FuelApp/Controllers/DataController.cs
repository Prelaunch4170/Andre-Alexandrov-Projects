
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

namespace FuelApp.Controllers
{
    public class DataController : Controller
    {
        private readonly HttpClient _httpClient;

        public DataController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> GetFuelData()
        {
            // URL of the external API
            var url = "https://fppdirectapi-prod.safuelpricinginformation.com.au/Price/GetSitesPrices?countryId=21&geoRegionLevel=3&geoRegionId=4";

            // Set up the header with the API Key (replace "YOUR_API_KEY" with your actual key)
            _httpClient.DefaultRequestHeaders.Clear();
            var FUEL_KEY = Environment.GetEnvironmentVariable("FUEL_KEY");
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"FPDAPI SubscriberToken={FUEL_KEY}");

            // Make the API request
            var response = await _httpClient.GetAsync(url);

            // Check if the response is successful
            if (response.IsSuccessStatusCode)
            {
                // Read and deserialize the response data
                var data = await response.Content.ReadAsStringAsync();

                // Here, you can parse the JSON response and pass it to the view or model
                // Assuming the data is in JSON format, you might deserialize it into a model object
                return Json( data); // You can pass 'data' to the view or deserialize it into a model
            }
            else
            {
                // Handle error if request fails
                ViewBag.ErrorMessage = "Failed to fetch fuel data from the external API.";
                return View("Error");
            }
        }
    }
}
