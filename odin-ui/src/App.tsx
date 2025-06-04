import './App.css';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect} from "react";

export const App = (): JSX.Element => {

    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
        const mapbox = new mapboxgl.Map({
            container: "map-container",
            center: [22.4673, 59.8613],
            zoom: 12,
        });

        mapbox.on('load', async () => {
            let coords: [[number, number], [number, number], [number, number], [number, number]] | undefined;
            try {

                const response = await fetch("http://localhost:8000/sar_coords");
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                coords = await response.json();
            } catch (e) {
                console.error("Failed to fetch SAR coordinates: ", e);
            }

            if(coords) {
                mapbox.addSource('sar', {
                    'type': 'image',
                    'url': 'http://localhost:8000/sar_image',
                    'coordinates': coords
                });
                mapbox.addLayer({
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
            mapbox.remove()
        }
    }, [])

    return (
        <>
            <div id="map-container"></div>
        </>
    )
}

