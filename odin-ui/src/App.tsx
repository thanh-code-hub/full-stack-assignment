import './App.css';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect, useRef} from "react";
import {useLighthouseLocation, useSarCoords, useShipLocation} from "./hooks";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const App = (): JSX.Element => {
    const {sarCoords} = useSarCoords()
    const {lighthouseCoords, fetchLighthouseLocation} = useLighthouseLocation()
    const {shipCoords} = useShipLocation()
    const mapRef = useRef<mapboxgl.Map>();

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: "map-container",
            center: [22.4673, 59.8613],
        });

        mapRef.current.on('load', () => {
            if (sarCoords && mapRef.current) {
                mapRef.current.addSource('sar', {
                    'type': 'image',
                    'url': 'http://localhost:8000/sar_image',
                    'coordinates': sarCoords
                });
                mapRef.current.addLayer({
                    id: 'sar-layer',
                    'type': 'raster',
                    'source': 'sar',
                    'paint': {
                        'raster-opacity': 1
                    }
                });

                let lonMin: number, lonMax: number, latMin: number, latMax: number;
                lonMin = latMin = 99
                lonMax = latMax = -99;

                sarCoords.forEach(coords => {
                    lonMin = coords[0] < lonMin ? coords[0] : lonMin;
                    lonMax = coords[0] > lonMax ? coords[0] : lonMax;
                    latMin = coords[1] < latMin ? coords[1] : latMin;
                    latMax = coords[1] > latMax ? coords[1] : latMax;
                })

                void fetchLighthouseLocation([latMin, lonMin, latMax, lonMax])

                mapRef.current.fitBounds([lonMin, latMin, lonMax, latMax]);

            }
        });
        return () => {
            if (mapRef.current)
                mapRef.current.remove()
        }
    }, [sarCoords, mapRef])

    useEffect(() => {
        if (lighthouseCoords) {
            lighthouseCoords.forEach((coord: [number, number]) => {
                const el = document.createElement("div")
                if (mapRef.current instanceof mapboxgl.Map) {
                    new mapboxgl.Marker({
                        "element": el,
                        "className": "marker-lighthouse"
                    })
                        .setLngLat(coord)
                        .addTo(mapRef.current);
                }
            })
        }
    }, [lighthouseCoords]);

    useEffect(() => {
        if (shipCoords && mapRef.current instanceof mapboxgl.Map) {
            const el = document.createElement("div")
            new mapboxgl.Marker({
                "element": el,
                "className": "marker-ship"
            })
                .setLngLat(shipCoords)
                .addTo(mapRef.current);
        }
    }, [shipCoords]);


    return <div id="map-container"></div>
}

