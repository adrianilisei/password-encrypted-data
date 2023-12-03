import Link from "next/link"

export default function SafeLink(p: { href?: string, className?: string, children: React.ReactNode }) {
    return (
        p.href ?
            <Link className={` ${p.className ?? ''} flex w-full`} href={p.href}>{p.children}</Link>
            :
            <div className={` ${p.className ?? ''} flex w-full`}>{p.children}</div>
    )
}
