import { useEffect, useRef, useState } from 'react'

export function useStateWithDeps(value, deps = []) {
    const [state, setState] = useState(value)
    const prevDeps = useRef(deps)

    useEffect(() => {
        if (JSON.stringify(deps) !== JSON.stringify(prevDeps.current)) {
            setState(value)
            prevDeps.current = deps
        }
    }, [deps, value])

    return [state, setState]
}