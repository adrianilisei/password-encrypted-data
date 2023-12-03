"use client"

import Button from "../../buttons/button"
import Spacing from "../../spacing/spacing"
import { CSSProperties, useEffect, useRef, useState } from "react"
import { NotificationType, type NotificationI, TradingBotI, TradingBotEnergyCapacity, TradingBotType, TradingBotTimespan, TradingBotPricing, STRATEGIES_LABELLED, StrategyEnergyConsumption, TradingBotFallbackType, TradingBotTiming, StrategySetupI, StrategyParamsI, CandlestickInterval } from "types"
import { actionsEditBotLabel, apiDeleteStrategySetup, apiDeleteTradingBot, apiRenewTradingBot, apiTradingBotToggleAutoRenew, apiTradingBotToggleTradingStatus, userGetNotifications } from "@/state/actions"
import { ArrowPathIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon, BellAlertIcon, BellIcon, BoltIcon, CheckIcon, CogIcon, CurrencyDollarIcon, PlusIcon, RectangleStackIcon, TrashIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/20/solid"
import { useQuery } from "react-query"
import PulseLoaderCircle from "../loaders/pulse-loader-circle"
import PulseWavesLoader from "../loaders/pulse-waves-loader"
import { TIME } from "utilities"
import currentUserStore from "@/stores/current-user"
import { get } from "svelte/store"
import { Switch } from "@radix-ui/themes"
import StrategySetupWidget from "../strategy/setup"
import { useToast } from "@/components/ui/use-toast"

export function generateLinkFromSetup(setup: StrategySetupI): string {
    const url = new URL(`http://localhost/strategy/${setup.setup.strategy_id}`)
    url.searchParams.set("token_base", setup.setup.token_symbol.base)
    url.searchParams.set("token_quote", setup.setup.token_symbol.quote)
    url.searchParams.set("candlesticks_interval", setup.setup.candlesticks_interval)
    url.searchParams.set("candlesticks_limit", setup.setup.candlesticks_limit.toString())
    url.searchParams.set("wallet_percent", setup.setup.wallet_percentage_per_transaction.toString())
    const paramsKeys = Object.keys(setup.setup.params)
    for (const key of paramsKeys) {
        url.searchParams.set(`param_${key}`, (setup.setup.params as any)[key])
    }
    return `${url.pathname}${url.search}`
}

export function generateSetupFromUrl(url: URL): Partial<StrategySetupI["setup"]> {
    const setup: Partial<StrategySetupI["setup"]> = {
        token_symbol: {
            base: url.searchParams.get("token_base") ?? "",
            quote: url.searchParams.get("token_quote") ?? ""
        },
        candlesticks_interval: (url.searchParams.get("candlesticks_interval") ?? CandlestickInterval["1d"]) as CandlestickInterval,
        candlesticks_limit: (url.searchParams.get("candlesticks_limit") ?? 1000) as number,
        wallet_percentage_per_transaction: (url.searchParams.get("wallet_percent") ?? 1) as number,
        params: {} as StrategyParamsI
    }
    url.searchParams.forEach((v, k) => {
        if (k.startsWith("param_")) {
            (setup.params as any)[k.substring(6)] = v as unknown as number
        }
    })
    return setup
}

export default function BotItemWidget(p: { bot: TradingBotI, onRefreshRequired?: () => void }) {

    const [user] = useState(get(currentUserStore))
    const [editingLabel, editingLabelSet] = useState(false)
    const runningStrategies: string | any[] = []
    const bot = p.bot

    const [label, labelSet] = useState(bot.label)
    let newLabel = ''
    const assignedStrategies = bot.strategies_setups.filter((s) => (s?.setup?.strategy_id ?? '') != '')
    const energyCapacity = TradingBotEnergyCapacity[bot.type] ?? TradingBotEnergyCapacity.classic
    const usedEnergy = bot?.status?.used_energy ?? 0
    const freeEnergy = energyCapacity - usedEnergy
    const expiresIn = (new Date(bot?.timestamps?.expiring ?? new Date())).getTime() - Date.now()
    const expired = expiresIn <= 0
    const [autoRenew, autoRenewSet] = useState(bot?.status?.auto_renew ?? false)
    const [activeStatus, activeStatusSet] = useState(bot?.status?.active ?? false)
    const [tradingPrevented, tradingPreventedSet] = useState(bot?.status?.trading_prevention ?? false)

    function startEditLabel() {
        newLabel = label ?? ''
        editingLabelSet(true)
    }

    async function stopEditLabel() {
        editingLabelSet(false)
        if (label == newLabel) return

        labelSet(newLabel)
        await actionsEditBotLabel(bot._id, newLabel)
    }

    const renewingBot = useRef(false)
    const [renewing, renewingSet] = useState(false)

    async function renewTradingBot() {
        if (renewingBot.current) return
        renewingBot.current = true
        renewingSet(true)

        const renewRes = await apiRenewTradingBot(p.bot._id)
        if (renewRes.success) p?.onRefreshRequired?.()

        renewingBot.current = false
        renewingSet(false)
    }

    const deletingBot = useRef(false)
    const [deleting, deletingSet] = useState(false)

    async function deleteTradingBot() {
        if (deletingBot.current) return
        deletingBot.current = true
        deletingSet(true)

        const renewRes = await apiDeleteTradingBot(p.bot._id)
        if (renewRes.success) p?.onRefreshRequired?.()

        deletingBot.current = false
        deletingSet(false)
    }

    const isTogglingAutoRenew = useRef(false)
    const [togglingAutoRenew, togglingAutoRenewSet] = useState(false)

    async function toggleAutoRenew() {
        if (isTogglingAutoRenew.current) return
        isTogglingAutoRenew.current = true
        togglingAutoRenewSet(true)


        const renewRes = await apiTradingBotToggleAutoRenew(p.bot._id)
        if (renewRes.success) p?.onRefreshRequired?.()

        isTogglingAutoRenew.current = false
        togglingAutoRenewSet(false)
        autoRenewSet((v) => !v)
    }

    const isTogglingActiveStatus = useRef(false)
    const [togglingActiveStatus, togglingActiveStatusSet] = useState(false)

    async function toggleActiveStatus() {
        if (isTogglingActiveStatus.current) return
        isTogglingActiveStatus.current = true
        togglingActiveStatusSet(true)


        const renewRes = await apiTradingBotToggleTradingStatus(p.bot._id)
        if (renewRes.success) p?.onRefreshRequired?.()

        isTogglingActiveStatus.current = false
        togglingActiveStatusSet(false)
        activeStatusSet((v) => !v)
    }


    const deletingSetupRef = useRef<Record<string, boolean>>({})
    const [deletingFromBot, deletingFromBotSet] = useState<Record<string, boolean>>({})

    const { toast } = useToast()

    async function deleteSetup(setupId: string) {
        if (deletingSetupRef.current?.[setupId] ?? false) return
        deletingSetupRef.current[setupId] = true
        deletingFromBotSet({ ...deletingSetupRef.current })

        const res = await apiDeleteStrategySetup(setupId)
        if (res.success) {
            p?.onRefreshRequired?.()
            toast({
                title: "Strategy removed"
            })
        } else toast({
            title: "Something went wrong",
            description: "Strategy couldn't be removed"
        })

        deletingSetupRef.current[setupId] = false
        deletingFromBotSet({ ...deletingSetupRef.current })
    }

    return <>
        <div
            style={{
                "--energy-used": usedEnergy,
                "--energy-free": freeEnergy,
                "--energy-used-alpha": "calc((var(--energy-used, 0)) / (var(--energy-used, 0) + var(--energy-free, 0)))"
            } as CSSProperties}
            className="flex flex-col w-full rounded-xl p-4 border border-border dark:border-border-dark bg-floating/50 dark:bg-floating-dark/50"
        >
            <div className="flex w-full gap-1 mb-2">
                <div className="flex rounded bg-surface-foreground/10 dark:bg-surface-foreground-dark/10 text-surface-foreground dark:text-surface-foreground-dark text-sm font-semibold leading-none p-1.5 capitalize">{bot.type} bot</div>
                {tradingPrevented && <>
                    <div className="flex justify-center items-center w-auto rounded bg-losses/75 dark:bg-losses-dark/75 text-losses-foreground dark:text-losses-foreground-dark text-sm font-semibold leading-none p-1.5">
                        <div className="flex w-auto">Global trading is prevented</div>
                    </div>
                    <div className="flex w-auto">
                        <Button xs href="/settings/trading" type="soft" icon={<CogIcon className="flex w-full h-full" />} label="Change on Settings" />
                    </div>
                </>
                }
            </div>
            <div className="flex justify-between items-center text-xs leading-none">
                <div className="flex justify-start items-center opacity-90 mr-4">
                    <BoltIcon className="w-4 h-4 mr-1 text-profits dark:text-profits-dark" />
                    <div className="opacity-50">Energy usage: {usedEnergy} / {energyCapacity}</div>
                </div>
                {editingLabel ?
                    <div>
                        <input
                            // on:blur={stopEditLabel}
                            className="flex w-auto max-w-xs border border-border dark:border-border-dark bg-floating/50 dark:bg-floating-dark/50 rounded p-0.5 px-1"
                            // bind:value={newLabel}
                            autoFocus
                            placeholder="No label"
                        />
                    </div>
                    :
                    <div
                        // on:click={startEditLabel}
                        className="flex group items-center opacity-50 cursor-default relative"
                    >
                        <div
                            className="hidden group-hover:flex justify-end absolute shrink-0 w-20 bottom-full right-0 text-xs opacity-50"
                        >
                            Click to edit
                        </div>
                        {(label ?? '') != '' ? label : 'No label'}
                    </div>
                }
            </div>
            <div
                className="flex w-full h-3 relative my-2 opacity-90 bg-surface-foreground/10 dark:bg-surface-foreground-dark/20 rounded-full"
            >
                <div
                    className="flex w-[calc(var(--energy-used-alpha,0)*100%)] absolute top-0 bottom-0 left-0 opacity-75 bg-profits dark:bg-profits-dark rounded-full"
                />
            </div>
            {runningStrategies.length > 0 &&
                <div className="flex w-full flex-row flex-wrap justify-start my-2">
                    <div className="flex w-[calc(100%+0.5rem)] flex-row flex-wrap justify-start -m-1">
                        {runningStrategies.map((s) => {
                            return <div key={s?.id} className="flex w-auto justify-self-start opacity-75 text-xs leading-relaxed m-1">
                                <Button
                                    small
                                    type="outlined"
                                    label={s.label}
                                    onClick={() => {
                                        // goto(`/strategy/${s.id}`)
                                    }}
                                />
                            </div>
                        })
                        }
                    </div>
                </div>
            }
            <div className="flex flex-col w-full justify-start my-2 text-sm leading-none opacity-90">
                <div className="flex flex-col gap-1 -m-1">
                    {assignedStrategies.length > 0 ?
                        assignedStrategies.map((setup) => {
                            return <StrategySetupWidget setup={setup} showLabel action={[
                                <div className="flex pl-2 opacity-75">
                                    <Button small type="outlined" loading={deletingSetupRef.current?.[setup._id]} icon={<TrashIcon className="flex flex-none" />} label={deletingSetupRef.current?.[setup._id] ? "Removing..." : undefined} onClick={() => {
                                        deleteSetup(setup._id)
                                    }}></Button>
                                </div>,
                                <div className="flex pl-2 opacity-75">
                                    <Button href={generateLinkFromSetup(setup)} small type="outlined" label="View"></Button>
                                </div>
                            ]} />
                        })
                        :
                        <div className="opacity-50 text-xs m-1">No strategies assigned</div>
                    }
                </div>
            </div>
            <div className="flex flex-col w-full justify-start my-2">
                <div className="flex justify-start items-center text-xs">
                    <Switch checked={togglingAutoRenew ? !autoRenew : autoRenew} onCheckedChange={toggleAutoRenew} radius="full" />
                    <div className="flex ml-2 opacity-50 font-semibold leading-none">
                        {togglingAutoRenew ? (autoRenew ? "Disabling auto renew..." : "Enabling auto renew...") : 'Auto renew'}
                    </div>
                </div>
                <div className="flex justify-start items-center mt-2 text-xs">
                    <Switch checked={togglingActiveStatus ? !activeStatus : activeStatus} onCheckedChange={toggleActiveStatus} radius="full" />
                    <div className="flex ml-2 opacity-50 font-semibold leading-none">
                        {togglingActiveStatus ? (activeStatus ? "Disabling trading..." : "Enabling trading...") : 'Trading'}
                    </div>
                </div>
                <div className="flex flex-col w-full mt-2 text-xs leading-none opacity-50">
                    {expiresIn <= TradingBotTiming.renew_threshold ?
                        (!bot?.status?.auto_renew ?
                            <div className="flex">
                                <Button
                                    small
                                    type="outlined"
                                    disabled={renewing}
                                    loading={renewing}
                                    label={`Renew for ${TradingBotPricing[bot?.type ?? TradingBotFallbackType]}$`}
                                    onClick={renewTradingBot}
                                />
                            </div>
                            : TradingBotPricing[bot?.type ?? TradingBotFallbackType] > user.wallet.credits ?
                                "Not enough credits to auto renewal"
                                :
                                <div>
                                    Auto renews in a few minutes...
                                    <div className="flex mt-2">
                                        <Button
                                            small
                                            type="outlined"
                                            disabled={renewing}
                                            loading={renewing}
                                            label={`Renew for ${TradingBotPricing[bot?.type ?? TradingBotFallbackType]}$`}
                                            onClick={renewTradingBot}
                                        />
                                    </div>
                                </div>)

                        :
                        (bot?.status?.auto_renew ? 'Auto renews in ' : 'Manual renewal required in ') +
                        (((expiresIn > 2 * TIME.DAY)
                            ? ((Math.floor(expiresIn / TIME.DAY) > 1)
                                ? (Math.floor(expiresIn / TIME.DAY) + ' days')
                                : '1 day')
                            : ((Math.floor(expiresIn / TIME.HOUR) > 1)
                                ? (Math.floor(expiresIn / TIME.HOUR) + ' hours')
                                : ('1 hour') + ((TradingBotPricing[bot?.type ?? TradingBotFallbackType] >
                                    user.wallet.credits)
                                    ? '. Make sure you have at least ' +
                                    TradingBotPricing[bot?.type ?? TradingBotFallbackType].toString() +
                                    '$'
                                    : ''))))
                    }
                </div>
            </div>
            {(freeEnergy > 0 || !autoRenew && expired) &&
                <div className="flex justify-end items-end !self-end gap-2 text-base leading-relaxed pt-5 mt-auto">
                    {!autoRenew && expired &&
                        <Button className="flex grow opacity-75" small type="ghost" theme="loss" label="Delete" icon={<TrashIcon />} loading={deleting} onClick={deleteTradingBot} />}
                    {freeEnergy > 0 && <Button className="flex grow opacity-50" small type="ghost" label={<div className="flex grow w-max flex-auto">Add strategy</div>} href="/strategies" icon={<PlusIcon />}>
                    </Button>}
                </div>
            }
        </div >

    </>
}
