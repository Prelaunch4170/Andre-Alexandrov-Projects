import React, { useEffect, useState, useRef } from 'react';

function MapPage() {
    var loadedFirst = useRef(false);
    const firstMapInstance = useRef(null);

    const [fuelData, setFuelData] = useState(null);
    const [siteData, setSiteData] = useState(null);

    const MAP_API = process.env.REACT_APP_MAP_API;
    const FUEL_API = process.env.REACT_APP_FUEL_API_TOKEN;

    const URL_FUEL = "https://fppdirectapi-prod.safuelpricinginformation.com.au/Price/GetSitesPrices?countryId=21&geoRegionLevel=3&geoRegionId=4";
    const URL_SITE = "https://fppdirectapi-prod.safuelpricinginformation.com.au/Subscriber/GetFullSiteDetails?countryId=21&geoRegionLevel=3&geoRegionId=4";


    const headers = {
        Authorization: `FPDAPI SubscriberToken=${FUEL_API}`,
        "Content-Type": "application/json"
    };
    const queried = useRef(false);
    useEffect(() => {

        if (!queried.current) {
            queried.current = true;
            console.log("TEST");
            fetch(URL_FUEL, { headers })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch fuel data");
                    }

                    return response.json();
                })
                .then((data) => setFuelData(data))
                .catch((error) => console.error("ERROR1: " + error));

            // Fetch site data
            //fetch(URL_SITE, { headers })
            //    .then((response) => {
            //        if (!response.ok) {
            //            throw new Error("Failed to fetch site data");
            //        }
            //        return response.json();
            //    })
            //    .then((data) => setSiteData(data))
            //    .catch((error) => console.error(error));
            console.log(fuelData);

            loadMap();
        }
        
    })

    
    function loadMap() {
        window.L.mapquest.key = MAP_API;

        window.L.mapquest.geocoding().reverse({ lat: 40.7128, lng: -74.0060 }, createFirstMap);
        function createFirstMap(error, response) {
            if (loadedFirst.current === false) {
                loadedFirst.current = true;
                console.log(loadedFirst)
                var location = response.results[0].locations[0];
                var latLng = location.displayLatLng;
                firstMapInstance.current = window.L.mapquest.map('map', {
                    center: latLng,
                    layers: window.L.mapquest.tileLayer('dark'),
                    zoom: 14
                });

                var customIcon = window.L.mapquest.icons.flag({
                    primaryColor: '#3b5998',
                    symbol: `aaa`
                });
                window.L.marker(latLng, { icon: customIcon }).addTo(firstMapInstance.current);

            }

        }
    }

    return (
        <div>
            <p>Test</p>
            <div id="map" style={{ width: "100 %", height: "530px" }} ></div>

            <h1>Fuel Data</h1>
            <pre>{JSON.stringify(fuelData, null, 2)}</pre>

            <h1>Site Data</h1>
            <pre>{JSON.stringify(siteData, null, 2)}</pre>
        </div>
        
    );
}

export default MapPage;
