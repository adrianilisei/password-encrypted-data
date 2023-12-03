import style from './pulse-waves-loader.module.css'

export default function PulseWavesLoader(p: { small?: boolean, large?: boolean }) {
    return (
        <>
            <div className="flex justify-center items-center p-4">
                <div className={`flex flex-none justify-center items-center ${p.small ? "w-8 h-8" : p.large ? "w-24 h-24" : "w-16 h-16"} bg-primary dark:bg-primary-dark rounded-full ${style["animate-pulse-waves"]} ${p.small ? style["small"] : p.large ? style["large"] : ""}`}>

                </div>
            </div>
        </>
    )
}