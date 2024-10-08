import {MutableRefObject, useEffect, useMemo, useState} from "react";

export default function useOnScreen(ref: MutableRefObject<HTMLElement|null>) {
    const [isIntersecting, setIntersecting] = useState<boolean>(false)

    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
    , {threshold: 1}), [ref])


    useEffect(() => {
        if (ref.current) {
            observer.observe(ref.current)
            return () => observer.disconnect()
        }
    }, [])

    return isIntersecting
}