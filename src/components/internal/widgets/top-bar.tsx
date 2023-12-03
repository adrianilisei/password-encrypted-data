export default function TopBar(p: { noTransparency?: boolean, children: React.ReactNode }) {
    return (
        <div className={`flex z-10 sticky top-0 w-full bg-surface dark:bg-surface-dark ${p.noTransparency
            ? ''
            : 'supports-[backdrop-filter]:bg-opacity-75 supports-[backdrop-filter]:backdrop-blur-xl dark:supports-[backdrop-filter]:bg-opacity-75 dark:supports-[backdrop-filter]:backdrop-blur-xl'} border-b border-border-dim dark:border-border-dim-dark`} >
            {p.children}
        </div>
    )
}
