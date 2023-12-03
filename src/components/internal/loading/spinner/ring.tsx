import { CSSProperties } from "react"

export default function RingLoadingSvg(p: { textColor?: string, progress?: number, lineWidthAlpha?: number, duration?: number }) {

	const r = 50 - ((p?.lineWidthAlpha ?? 0) * 50) / 2
	const c = Math.PI * r * 2

	return <>
		<svg
			style={{
				strokeLinecap: "round",
				color: (p?.textColor ?? "currentColor"),
				["--p"]: p?.progress ? p?.progress : `var(--progress, ${p?.progress ?? 0})`,
				["--wa"]: p?.lineWidthAlpha ? p?.lineWidthAlpha : `var(--width-alpha,${p?.lineWidthAlpha ?? 0.2})`,
				["--r"]: "calc(50 - var(--wa) * 50 / 2)",
				["--pi"]: Math.PI,
				["--c"]: "calc(var(--pi) * var(--r) * 2)",
				["--duration"]: p?.duration ?? 500
			} as CSSProperties}
			className="transition-all [transition-duration:calc(var(--duration,500)*1ms)] ease-linear stroke-current -rotate-90 max-h-screen"
			viewBox="0 0 100 100"
			width="100%"
			height="100%"
		>
			<circle
				className="transition-all [transition-duration:calc(var(--duration,500)*1ms)] ease-linear fill-[none] text-current stroke-current"
				cx="50"
				cy="50"
				r={r}
				strokeWidth={((p?.lineWidthAlpha ?? 0) * 100) / 2}
				strokeDasharray={c}
				strokeDashoffset={((100 - (p?.progress ?? 0)) / 100) * c}
			/>
		</svg>
	</>
}
