import {useEffect, useRef, useState} from "react";
import {cn} from "@nextui-org/theme";

export const KeepAspect = (p: {
    className?: string
    aspect: number
    objectFit: 'cover' | 'contain'
    children: React.ReactNode
}) => {
    const [outerSize, setOuterSize] = useState({ width: 0, height: 0 })
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (ref.current) {
                setOuterSize({
                    width: ref.current.offsetWidth,
                    height: ref.current.offsetHeight,
                })
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const innerWidthWidth = outerSize.width
    const innerHeightWidth = outerSize.width / p.aspect

    const innerWidthHeight = outerSize.height * p.aspect
    const innerHeightHeight = outerSize.height

    const baseOnWidth =
        p.objectFit === 'cover'
            ? innerHeightWidth > outerSize.height
            : innerHeightWidth < outerSize.height

    const innerWidth = baseOnWidth ? innerWidthWidth : innerWidthHeight
    const innerHeight = baseOnWidth ? innerHeightWidth : innerHeightHeight

    return (
        <div ref={ref} className={cn(p.className, 'relative')}>
            <div className='absolute inset-0 flex items-center justify-center'>
                <div
                    className='h-full w-full'
                    style={{
                        minWidth: innerWidth,
                        minHeight: innerHeight,
                    }}
                >
                    {p.children}
                </div>
            </div>
        </div>
    )
}
