import { useRef, useState } from 'react'

export function useQuery(query) {
    const callCount = useRef(0)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const isLoadingEnabled = useRef(true)

    const call = async (...params) => {
        callCount.current += 1
        if (isLoadingEnabled.current) {
            console.log('Loading data...')
            setIsLoading(true)
        }
        setError(null)
        setIsError(false)

        try {
            const res = await query(...params)
            setData(res)
        } catch (err) {
            console.error('Error executing query:', err)
            setError(err)
            setIsError(true)
        } finally {
            if (isLoadingEnabled.current) {
                setIsLoading(false)
            } else {
                isLoadingEnabled.current = true
            }
        }
    }

    const callOnce = async (...params) => {
        if (callCount.current > 0) return
        await call(...params)
    }

    const disableNextLoading = () => isLoadingEnabled.current = false

    return { data, isLoading, isError, error, call, callOnce, disableNextLoading }
}