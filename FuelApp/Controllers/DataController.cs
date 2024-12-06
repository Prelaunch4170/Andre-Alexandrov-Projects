
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json.Serialization;
using System.Text.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using FuelApp.Models;

namespace FuelApp.Controllers
{
    public class DataController : Controller
    {
        private readonly HttpClient _httpClient;
        static Dictionary<int, string> Fuels = new Dictionary<int, string> { { 2, "Unleaded" }, { 3, "Diesel" }, { 4, "LPG" }, 
            { 5, "Premium Unleaded 95" }, { 6, "ULSD" }, { 8, "Premium Unleaded 98" }, { 11, "LRP" }, { 12, "e10" }, { 13, "Premium e5" }, 
            { 14, "Premium Diesel" }, { 16, "Bio-Diesel 20" }, { 19, "e85" }, { 21, "OPAL" }, { 22, "Compressed natural gas" }, 
            { 23, "Liquefied natural gas" }, { 999, "e10/Unleaded" }, { 1000, "Diesel/Premium Diesel" } };

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
            var FUEL_PRICE = "https://fppdirectapi-prod.safuelpricinginformation.com.au/Price/GetSitesPrices?countryId=21&geoRegionLevel=3&geoRegionId=4";
            var SITES = "https://fppdirectapi-prod.safuelpricinginformation.com.au/Subscriber/GetFullSiteDetails?countryId=21&geoRegionLevel=3&geoRegionId=4";

            
            _httpClient.DefaultRequestHeaders.Clear();
            
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"FPDAPI SubscriberToken={Environment.GetEnvironmentVariable("FUEL_KEY")}");

            // Make the API request
            var responsePrice = await _httpClient.GetAsync(FUEL_PRICE);
            var responseLoc = await _httpClient.GetAsync(SITES);
            // Check if the response is successful
            if (responsePrice.IsSuccessStatusCode && responseLoc.IsSuccessStatusCode)
            {
                // Read and deserialize the response data
                var dataPrice = await responsePrice.Content.ReadAsStringAsync();
                var dataLoc = await responseLoc.Content.ReadAsStringAsync();


                JObject locations = JObject.Parse(dataLoc);
                JArray locationsArray = (JArray)locations["S"];
                JObject prices = JObject.Parse(dataPrice);
                JArray priceArray = (JArray)prices["SitePrices"];

                
                List<Location> locationsDetails = new List<Location>();
                foreach (var location in locationsArray)
                {
                   //initilise the location and create empty dictionary to be replaced later
                    Location loc = new Location
                    {
                        locationID = location["S"].Value<int>(),
                        locationName = location["N"].ToString(),
                        lat = location["Lat"].Value<double>(),
                        lng = location["Lng"].Value<double>(),
                        FuelPrices = new Dictionary<string, double>()
                    };
                    Dictionary<string, double> locPrices = new Dictionary<string, double>();
                    foreach(var price in priceArray)// get the fuels for a location and add it to a dictionary to then replace the on in loc
                    {
                        if (price["SiteId"].Value<int>() == loc.locationID)
                        {
                            var fuel = price["FuelId"].Value<int>();
                            locPrices.Add(Fuels[fuel], price["Price"].Value<double>());
                        }
                    }
                    loc.FuelPrices = locPrices;
                    locationsDetails.Add(loc);
                }

                var data = new[] { locationsDetails };


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
