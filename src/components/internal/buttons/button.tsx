import { MouseEvent } from "react"
import SafeLink from "../utils/safe-link"
import RingSpinner from "../loading/spinner/ring-spin"

export default function Button(p: { href?: string, disabled?: boolean, loading?: boolean, xs?: boolean, small?: boolean, large?: boolean, type?: 'solid' | "soft" | 'outlined' | 'ghost', theme?: 'default' | 'primary' | 'secondary' | "profit" | "loss", dim?: boolean, beforeIcon?: React.ReactNode, icon?: React.ReactNode, label?: string | React.ReactNode, roundedFull?: boolean, dimmed?: boolean, onClick?: (() => void) | ((e: MouseEvent<HTMLDivElement, MouseEvent>) => void), onDisabledClick?: () => void, onAnyClick?: () => void, className?: string, classNameLink?: string, children?: React.ReactNode }) {

    const onClick = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (p.onAnyClick) p?.onAnyClick?.()
        else if (p.disabled) p?.onDisabledClick?.()
        else p?.onClick?.(e)
    }

    return (
        <div onClick={(e) => {
            onClick(e as unknown as MouseEvent<HTMLDivElement, MouseEvent>)
        }} data-disabled={p.disabled} data-loading={p.loading}
            className={`${p.className ? p.className : ''} flex justify-center items-center text-center w-full select-none transition-all !shadow-surface-foreground/25 dark:!shadow-surface-foreground-dark/25 ${p.dim ? 'opacity-50' : ''} ${p.disabled || p.loading
                ? 'opacity-50'
                : p.small || p.xs
                    ? '[@media(pointer:fine)]:hover:shadow !shadow-surface-foreground/25 dark:!shadow-surface-foreground-dark/25'
                    : p.large
                        ? '[@media(pointer:fine)]:hover:shadow-2xl !shadow-surface-foreground/25 dark:!shadow-surface-foreground-dark/25'
                        : '[@media(pointer:fine)]:hover:shadow-lg !shadow-surface-foreground/25 dark:!shadow-surface-foreground-dark/25'} ${!p.disabled &&
                            !p.loading
                            ? 'active:scale-95'
                            : ''}
    ${p.small || p.xs
                    ?
                    (p.roundedFull ? 'rounded-full' : 'rounded-lg') +
                    ' text-xs'
                    : p.large
                        ?
                        (p.roundedFull ? 'rounded-full' : 'rounded-2xl') +
                        ' text-md'
                        :
                        (p.roundedFull ? 'rounded-full' : 'rounded-xl') +
                        ' text-sm'} font-bold cursor-default ${p.dimmed
                            ? 'bg-opacity-[0.15] dark:bg-opacity-25 data-[loading=true]:bg-opacity-10 data-[inactive=true]:bg-opacity-5 dark:data-[loading=true]:bg-opacity-20 dark:data-[inactive=true]:bg-opacity-10 data-[inactive=true]:text-opacity-50 data-[inactive=true]:border-opacity-50 data-[loading=true]:border-opacity-75'
                            : 'data-[loading=true]:bg-opacity-70 data-[inactive=true]:bg-opacity-50 data-[inactive=true]:text-opacity-50 data-[inactive=true]:border-opacity-50 data-[loading=true]:border-opacity-75'}
                    ${(p.type == "ghost" ?
                    "bg-transparent dark:bg-transparent" + (p.theme == "primary" ? " text-primary dark:text-primary-dark hover:bg-primary hover:dark:bg-primary-dark hover:text-primary-foreground hover:dark:text-primary-foreground-dark" : (p.theme == "secondary" ? " text-secondary dark:text-secondary-dark hover:bg-secondary hover:dark:bg-secondary-dark hover:text-secondary-foreground hover:dark:text-secondary-foreground-dark" : (p.theme == "profit" ? " text-profits dark:text-profits-dark hover:bg-profits hover:dark:bg-profits-dark hover:text-profits-foreground hover:dark:text-profits-foreground-dark" : (p.theme == "loss" ? " text-losses dark:text-losses-dark hover:bg-losses hover:dark:bg-losses-dark hover:text-losses-foreground hover:dark:text-losses-foreground-dark" : " text-surface-foreground dark:text-surface-foreground-dark hover:bg-surface-foreground hover:dark:bg-surface-foreground-dark hover:text-surface hover:dark:text-surface-dark"))))
                    : (p.type == "outlined" ?
                        ' bg-transparent dark:bg-transparent border hover:border-transparent hover:dark:border-transparent' + (p.theme == "primary" ? ' text-primary dark:text-primary-dark border-primary dark:border-primary-dark hover:bg-primary hover:dark:bg-primary-dark hover:text-primary-foreground hover:dark:text-primary-foreground-dark' : (p.theme == "secondary" ? ' text-secondary dark:text-secondary-dark border-secondary dark:border-secondary-dark hover:bg-secondary hover:dark:bg-secondary-dark hover:text-secondary-foreground hover:dark:text-secondary-foreground-dark' : (p.theme == "profit" ? ' text-profits dark:text-profits-dark border-profits dark:border-profits-dark hover:bg-profits hover:dark:bg-profits-dark hover:text-profits-foreground hover:dark:text-profits-foreground-dark' : (p.theme == "loss" ? ' text-losses dark:text-losses-dark border-losses dark:border-losses-dark hover:bg-losses hover:dark:bg-losses-dark hover:text-losses-foreground hover:dark:text-losses-foreground-dark' : ' text-surface-foreground dark:text-surface-foreground-dark border-surface-foreground dark:border-surface-foreground-dark hover:bg-surface-foreground hover:dark:bg-surface-foreground-dark hover:text-surface hover:dark:text-surface-dark'))))
                        : (p.type == "soft" ?
                            (p.theme == "primary" ? 'bg-primary/20 dark:bg-primary-dark/20 text-primary/75 dark:text-primary-dark/75' : (p.theme == "secondary" ? 'bg-secondary/20 dark:bg-secondary-dark/20 text-secondary/75 dark:text-secondary-dark/75' : 'bg-surface-foreground/20 dark:bg-surface-foreground-dark/20 text-surface-foreground/75 dark:text-surface-foreground-dark/75')) :
                            (p.theme == "primary" ? 'bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark' : (p.theme == "secondary" ? 'bg-secondary dark:bg-secondary-dark text-secondary-foreground dark:text-secondary-foreground-dark' : (p.theme == "profit" ? 'bg-profits dark:bg-profits-dark text-profits-foreground dark:text-profits-foreground-dark' : (p.theme == "loss" ? 'bg-losses dark:bg-losses-dark text-losses-foreground dark:text-losses-foreground-dark' : 'bg-surface-foreground dark:bg-surface-foreground-dark text-surface dark:text-surface-dark'))))
                        )))}`
            }>
            <SafeLink href={p.disabled ? undefined : p.href} className={`${p.classNameLink ?? ''} flex justify-center items-center w-full h-full leading-none ${p.xs ? 'p-1' +
                ((p?.label ?? "") !== "" ? ' px-1.5 ' : ' ')
                :
                p.small
                    ? 'p-1.5' +
                    ((p?.label ?? "") !== "" ? ' px-2 ' : ' ')
                    : p.large
                        ? 'p-3.5' +
                        ((p?.label ?? "") !== "" ? ' px-6 ' : ' ')
                        : 'p-2.5' +
                        ((p?.label ?? "") !== "" ? ' px-4 ' : ' ')} cursor-default`}>
                {p?.beforeIcon !== undefined && p.beforeIcon}
                {p.icon !== undefined || p.loading ? <div className={`flex ${p.xs ? 'w-3 h-3' + ((p?.label ?? "") !== "" ? ' mr-0.5' : '') : p.small ? 'w-3 h-3' + ((p?.label ?? "") !== "" ? ' mr-1' : '') : p.large ? 'w-5 h-5' + ((p?.label ?? "") !== "" ? ' mr-1.5' : '') : 'w-4 h-4' + ((p?.label ?? "") !== "" ? ' mr-1' : '')}`}>{
                    p.loading ? <RingSpinner /> : p.icon
                }</div>
                    : null}
                {(p?.label ?? "") !== "" ? <div>{p.label}</div> : null}
            </SafeLink>
        </div>
    )
}
