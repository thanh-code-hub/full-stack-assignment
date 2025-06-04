import {useEffect, useState} from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export default function useShipLocation() {
    const [shipCoords, setShipCoords] = useState<[number, number] | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
       const fetchShipLocation = async () => {
           setLoading(true)
           const res = await fetch(`${BASE_URL}/ship`)
               .catch((err) => {
                   // @ts-ignore
                   setError(res.status)
                   console.log(err)
               }).finally(() => setLoading(false));

           // @ts-ignore
           if(!res.ok)
               setError("Error while fetching ship location")
           // @ts-ignore
           setShipCoords(await res.json())
       }
       void fetchShipLocation()
    }, [])

    return {shipCoords, loading, error}
}