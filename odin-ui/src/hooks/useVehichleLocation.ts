import {useEffect, useState} from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export default function useVehichleLocation() {
    const [vehicleCoord, setVehicleCoord] = useState<[number, number] | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
       const fetchVehicleLocation = async () => {
           setLoading(true)
           const res = await fetch(`${BASE_URL}/vehicle`)
               .catch((err) => {
                   // @ts-ignore
                   setError(res.status)
                   console.log(err)
               }).finally(() => setLoading(false));

           // @ts-ignore
           if(!res.ok)
               setError("Error while fetching vehicle location")
           // @ts-ignore
           setVehicleCoord(await res.json())
       }
       void fetchVehicleLocation()
    }, [])

    return {vehicleCoord, loading, error}
}