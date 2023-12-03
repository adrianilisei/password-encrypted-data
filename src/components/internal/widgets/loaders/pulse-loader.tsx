export default function PulseLoader() {
    return (
        <>
            <div className="flex justify-center items-center w-full min-h-[50vh]">
                <div className="flex justify-center items-center animate-bounce">
                    <div className="flex flex-none justify-center items-center w-16 h-16 bg-gradient-to-br from-surface-foreground dark:from-surface-foreground-dark to-primary dark:to-primary-dark rounded-full animate-spin">
                        <div className="flex flex-none w-12 h-12 bg-surface dark:bg-surface-dark rounded-full"></div>
                    </div>
                </div>
            </div>
        </>
    )
}