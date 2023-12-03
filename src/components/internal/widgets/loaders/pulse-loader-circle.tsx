import style from './pulse-loader.module.css'

export default function PulseLoaderCircle(p: { small?: boolean, large?: boolean }) {
    return (
        <>
            <div className="flex justify-center items-center">
                <div className={`flex flex-none justify-center items-center ${p.small ? "w-8 h-8" : p.large ? "w-24 h-24" : "w-16 h-16"} bg-primary dark:bg-primary-dark rounded-full ${style["animate-ping-gentle"]}`}>
                    <div className={`flex flex-none ${p.small ? "w-4 h-4" : p.large ? "w-18 h-18" : "w-12 h-12"} bg-primary-foreground dark:bg-primary-foreground-dark rounded-full`}></div>
                </div>
            </div>
        </>
    )
}