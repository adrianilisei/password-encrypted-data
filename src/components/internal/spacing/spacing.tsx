export default function Spacing(p: { notLeft?: boolean, notRight?: boolean, notTop?: boolean, notBottom?: boolean, onlyLeft?: boolean, onlyRight?: boolean, onlyTop?: boolean, onlyBottom?: boolean, size?: 'md' | 'sm' | 'lg', autoScale?: 'auto' | 'base' | 'md' | 'lg' | 'xl', fullHeight?: boolean, children: React.ReactNode }) {
    return (
        <div className={`flex justify-between w-full ${p.fullHeight ? 'h-full' : ''} ${p.size == 'sm' ?
            (p.autoScale == 'base' ? 'p-1' : p.autoScale == 'md' ? 'p-2' : p.autoScale == 'lg' ? 'p-3' : p.autoScale == 'xl' ? 'p-4' : 'p-1 md:p-2 lg:p-3 xl:p-4') : p.size == 'lg' ?
                (p.autoScale == 'base' ? 'p-3' : p.autoScale == 'md' ? 'p-4' : p.autoScale == 'lg' ? 'p-5' : p.autoScale == 'xl' ? 'p-6' : 'p-3 md:p-4 lg:p-5 xl:p-6') :
                (p.autoScale == 'base' ? 'p-2' : p.autoScale == 'md' ? 'p-3' : p.autoScale == 'lg' ? 'p-4' : p.autoScale == 'xl' ? 'p-5' : 'p-2 md:p-3 lg:p-4 xl:p-5')} ${p.notLeft || p.onlyTop || p.onlyBottom || p.onlyRight ? "!pl-0" : ""} ${p.notRight || p.onlyTop || p.onlyBottom || p.onlyLeft ? "!pr-0" : ""} ${p.notTop || p.onlyBottom || p.onlyLeft || p.onlyRight ? "!pt-0" : ""} ${p.notBottom || p.onlyTop || p.onlyLeft || p.onlyRight ? "!pb-0" : ""}`} >
            {p.children}
        </div>
    )
}
