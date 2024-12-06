import React, { useEffect, useState, useRef } from 'react';

function MapPage() {
    var loadedFirst = useRef(false);
    const firstMapInstance = useRef(null);
    const MAP_API = process.env.REACT_APP_MAP_API;
    console.log("test "+ MAP_API);
    useEffect(() => {
        
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
    })

    
    function loadMap() {
       
    }

    return (
        <div>
            <p>Test</p>
            <div id="map" style={{ width: "100 %", height: "530px" }} ></div>
        </div>
        
    );
}

export default MapPage;
