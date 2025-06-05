import {useState} from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export default function useLighthouseLocation() {
    const [lighthouseCoords, setLighthouseCoords] = useState<[number, number][]>()
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    const fetchLighthouseLocation = async (bbox: [number, number, number, number]) => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/seamarks?bbox=${bbox.join(",")}`) as Response
            if (!response.ok)
                throw new Error(`Error while fetching lighthouse locations: ${response.status}`)
            setLighthouseCoords(await response.json())
        }
        catch (error) {
            if(typeof error === "string") {
                setError(error)
            } else {
                console.error(error)
                setError("Error while fetching lighthouse locations")
            }
        }
        setLoading(false)
    }

    return {lighthouseCoords, fetchLighthouseLocation, loading, error}
}