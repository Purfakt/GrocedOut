import { useRef, useState } from 'react'

export function useQuery(query) {
    const callCount = useRef(0)
    const [params, setParams] = useState([])
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const delay = useRef(1000)
    const isLoadingEnabled = useRef(true)

    const call = async (...callParams) => {
        callCount.current += 1
        setParams(callParams)
        if (isLoadingEnabled.current) {
            console.log('Loading data...')
            setIsLoading(true)
        }
        setError(null)
        setIsError(false)

        try {
            if (delay.current > 0) {
                await new Promise(resolve => setTimeout(resolve, delay.current))
            }
            const res = await query(...callParams)
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

    const callOnce = async (...callParams) => {
        if (callCount.current > 0) return
        await call(...callParams)
    }

    const setDelay = (delay) => delay.current = delay
    const disableNextLoading = () => isLoadingEnabled.current = false

    return { params, data, isLoading, isError, error, call, callOnce, setDelay, disableNextLoading }
}