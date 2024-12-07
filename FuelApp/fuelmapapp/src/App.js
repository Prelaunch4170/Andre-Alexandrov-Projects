import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
function App() {
    var loadedFirst = useRef(false);
    const firstMapInstance = useRef(null);
    const [fuelData, setFuelData] = useState(null);
    var loadedData = useRef(false);

    useEffect(() => {

        if (!loadedData.current) {
            loadedData.current = true;
            console.log("TEST");
            fetch("https://localhost:7192/Data/GetFuelData")
                .then(response => response.json())
                .then(data => addMarkers(data))
                .catch(err => {
                    console.log(err);
                });

                
            
        }
        //console.log(fuelData);
        
    })
    const MAP_API = process.env.REACT_APP_MAP_API;
    const FUEL_API = process.env.REACT_APP_FUEL_API_TOKEN;

    useEffect(() => {
        window.L.mapquest.key = MAP_API;
        var latitude = -34.92866;
        var longitude = 138.59863;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
            }
            )
        }

        window.L.mapquest.geocoding().reverse({ lat: latitude, lng: longitude }, createFirstMap);
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
                //console.log(fuelData);
                addMarkers(fuelData);
            }

        }
    }, [fuelData])


    function addMarkers(data) {
        
        if (data !== null) {
            console.log( data);
            for (const location of data) {
                var marker = window.L.marker({ lat: location.lat, lng: location.lng }, {
                    icon: window.L.mapquest.icons.marker({
                        primaryColor: '#FF5733', // Customize marker color
                        secondaryColor: '#333333',
                        symbol: location.locationName ? location.locationName[0].toUpperCase() : '' // Use the first letter of the name as a symbol
                    })
                })
                var display = `${location.locationName} Prices`
                for (const [fuelType, price] of Object.entries(location.fuelPrices)) {
                    display += `<br> ${fuelType}: $${(price/10).toFixed(1)}`;
                }
               
                marker.addTo(firstMapInstance.current);
                marker.bindPopup(display);
                
            }
        }
        

    }

    
  return (
    <div className="App">
        <div id="map" style={{ width: "100 %", height: "800px" }} ></div>
    </div>
  );
}

export default App;
