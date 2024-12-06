namespace FuelApp.Models
{
    public class Location
    {
        public int locationID {  get; set; }
        public required string locationName { get; set; }

        public double lat {  get; set; }
        public double lng { get; set; }

        public Dictionary<string, double>? FuelPrices { get; set; }
    }
}
