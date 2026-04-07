import { useEffect, useState } from 'react'

export function useDebounced(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cancel previous timer if value changes before timeout elapses
        return () => clearTimeout(timeout)
    }, [value, delay])

    return debouncedValue
}
