import { useRef, useState } from 'react'

export function useRequest(request) {
    const callCount = useRef(0)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const call = async () => {
        callCount.current += 1
        setIsLoading(true)
        setError(null)
        setIsError(false)

        try {
            const res = await request()
            setData(res)
        } catch (err) {
            console.error('Error executing request:', err)
            setError(err)
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const callOnce = async () => {
        if (callCount.current > 0) return
        await call()
    }

    return { data, isLoading, isError, error, call, callOnce }
}