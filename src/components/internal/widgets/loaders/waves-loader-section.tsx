import PulseWavesLoader from "./pulse-waves-loader"

export default function WavesLoaderSection(p: { small?: boolean, large?: boolean }) {
    return (
        <>
            <div className="flex justify-center items-center w-full min-h-[50vh]">
                <PulseWavesLoader {...p}></PulseWavesLoader>
            </div>
        </>
    )
}