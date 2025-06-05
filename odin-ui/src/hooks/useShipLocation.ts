import {useEffect, useState} from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export default function useShipLocation() {
    const [shipCoords, setShipCoords] = useState<[number, number] | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
       const fetchShipLocation = async () => {
           setLoading(true)
           try{
               const response = await fetch(`${BASE_URL}/ship`) as Response

               if(!response.ok)
                   throw new Error(`Error while fetching ship location: ${response.status}`)
               setShipCoords(await response.json())
           }
           catch (e) {
               if(typeof e === 'string')
                   setError(e)
               else {
                   setError("Error while fetching ship location")
                   console.error(e)
               }
           }
           setLoading(false)
       }
       void fetchShipLocation()
    }, [])

    return {shipCoords, loading, error}
}