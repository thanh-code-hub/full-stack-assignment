import {useState, useEffect} from "react";

type SarCoords = [[number, number], [number, number], [number, number], [number, number]];

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export default function useSarCoords() {
    const [sarCoords, setSarCoords] = useState<SarCoords | undefined>()
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchSarCoords = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${BASE_URL}/sar_coords`) as Response
                if(!res.ok)
                    setError(`Error while fetching SAR coords: ${res.status}`)
                setSarCoords(await res.json())
            }
            catch (e) {
                if(typeof e === 'string')
                    setError(e)
                else {
                    setError("Error while fetching SAR coords")
                    console.error(e)
                }
            }
            setLoading(false)
        }
        void fetchSarCoords()
    }, [])

    return {sarCoords, loading, error}
}