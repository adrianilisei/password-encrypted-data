import { CSSProperties, useEffect, useState } from "react"
import RingLoadingSvg from "./ring"

const animationDurationFallback = 2500
export default function RingSpinner(p?: { animationDuration?: number }) {

	const [loadingRingProgress, loadingRingProgressSet] = useState(0)

	useEffect(() => {
		function setRingProgress() {
			loadingRingProgressSet(25 + Math.random() * 65)
		}
		setRingProgress()

		const i = setInterval(setRingProgress, p?.animationDuration ?? animationDurationFallback)
		return () => {
			clearInterval(i)
		}
	}, [])

	return <>
		<div
			style={{
				"--duration": `${((p?.animationDuration ?? animationDurationFallback) / 2)}ms`
			} as CSSProperties}
			className="flex w-full justify-center items-center h-full max-h-12 [animation:_spin_var(--duration,1s)_linear_infinite]"
		>
			<RingLoadingSvg progress={loadingRingProgress} lineWidthAlpha={0.25} duration={(p?.animationDuration ?? animationDurationFallback) * 2} />
		</div>
	</>
}
