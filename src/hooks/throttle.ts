import { throttle } from "lodash"
import { useCallback, useEffect, useRef } from "react"

export function useThrottle(cb: (...args: any[]) => any, delay: number) {
    const options = { leading: true, trailing: false } // add custom lodash options
    const cbRef = useRef(cb)
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => { cbRef.current = cb })
    return useCallback(
        throttle((...args) => cbRef.current(...args), delay, options),
        [delay]
    )
}