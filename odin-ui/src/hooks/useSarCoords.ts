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
            const res = await fetch(`${BASE_URL}/sar_coords`)
                .catch((err) => {
                    // @ts-ignore
                    setError(res.status)
                    console.log(err)
                }).finally(() => setLoading(false));
            // @ts-ignore

            if(!res.ok)
                setError("Error while fetching coords")
            // @ts-ignore
            setSarCoords(await res.json())
        }
        void fetchSarCoords()
    }, [])

    return {sarCoords, loading, error}
}