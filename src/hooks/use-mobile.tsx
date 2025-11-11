import * as React from "react"
import { isNativeApp } from "@/utils/platformDetection"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Compute initial value synchronously - no delay!
    if (isNativeApp()) {
      return true
    }
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    // If running in native app, no need to listen for changes
    if (isNativeApp()) {
      return
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
