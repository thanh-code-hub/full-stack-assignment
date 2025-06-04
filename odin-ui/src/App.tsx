import './App.css';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect, useRef} from "react";
import {useLighthouseLocation, useSarCoords, useVehichleLocation} from "./hooks";

export const App = (): JSX.Element => {
    const {sarCoords} = useSarCoords()
    const {lighthouseCoords} = useLighthouseLocation()
    const {vehicleCoord} = useVehichleLocation()
    const mapRef = useRef<mapboxgl.Map>();

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: "map-container",
            center: [22.4673, 59.8613],
            zoom: 11,
        });

        mapRef.current.on('load', async () => {
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
            }
        });
        return () => {
            if (mapRef.current)
                mapRef.current.remove()
        }
    }, [sarCoords, mapRef])

    useEffect(() => {
        if (lighthouseCoords && mapRef.current) {
            const el = document.createElement("div")
            lighthouseCoords.forEach((coord: [number, number]) => {
                new mapboxgl.Marker({
                    "element": el,
                    "className": "marker-lighthouse"
                })
                    .setLngLat(coord)
                    // @ts-ignore
                    .addTo(mapRef.current);
            })
        }
    }, [lighthouseCoords]);

    useEffect(() => {
        if (vehicleCoord && mapRef.current) {
            const el = document.createElement("div")
            new mapboxgl.Marker({
                "element": el,
                "className": "marker-vehicle"
            })
                .setLngLat(vehicleCoord)
                // @ts-ignore
                .addTo(mapRef.current);
        }
    }, [vehicleCoord]);


    return <div id="map-container"></div>
}

