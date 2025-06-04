import {useEffect, useState} from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export default function useLighthouseLocation() {
    const [lighthouseCoords, setLighthouseCoords] = useState<[number, number][]>()
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchLighthouseLocation = async () => {
            setLoading(true)
            const res = await fetch(`${BASE_URL}/seamarks`)
                .catch((err) => {
                    // @ts-ignore
                    setError(res.status)
                    console.log(err)
                }).finally(() => setLoading(false));
            // @ts-ignore
            if(!res.ok)
                setError("Error while fetching lighthouse locations")
            // @ts-ignore
            setLighthouseCoords(await res.json())
        }
        void fetchLighthouseLocation()
    }, [])

    return {lighthouseCoords, loading, error}
}