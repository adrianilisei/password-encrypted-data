import { STRATEGIES_LABELLED, StrategyEnergyConsumption, StrategyParams, StrategyParamsLabels, StrategySetupI } from "types"
import Spacing from "../../spacing/spacing"
import Button from "../../buttons/button"
import { BoltIcon, DocumentDuplicateIcon, LinkIcon, TrashIcon, WalletIcon } from "@heroicons/react/20/solid"
import { TIME } from "utilities"

export default function StrategySetupWidget(p: { setup: StrategySetupI, showLabel?: boolean, onDelete?: (setup: StrategySetupI) => void, onCopy?: (setup: StrategySetupI) => void, onLink?: (setup: StrategySetupI) => void, action?: React.ReactNode | React.ReactNode[] }) {

    const strategy = STRATEGIES_LABELLED.find((s) => s.id == p?.setup?.setup?.strategy_id)
    const botId = p?.setup?.bot_id ?? ""
    const lastSignal = p.setup?.setup?.signal?.last_side ?? null
    const lastSignalTs = new Date(p.setup?.setup?.signal?.timestamps.set ?? Date.now())
    const timeAgo = Date.now() - lastSignalTs.getTime()

    return (!p.setup ? null :
        <>
            <div className="flex w-full border rounded-lg">
                <Spacing autoScale="base">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-auto flex-col">
                            {p.showLabel && <div className="flex justify-start items-start flex-wrap text-xs opacity-50">{strategy?.label}</div>}
                            <div className="flex justify-start items-start w-full flex-wrap text-xs -m-1 -mx-2 leading-none relative">
                                <div className="m-1 mx-2">{p?.setup?.setup?.token_symbol?.base}/{p?.setup?.setup?.token_symbol?.quote}</div>
                                <div className="m-1 mx-2">
                                    {p?.setup?.setup?.candlesticks_interval}
                                </div>
                                <div className="flex justify-center items-center m-1 mx-2">
                                    {StrategyEnergyConsumption[p?.setup?.setup?.candlesticks_interval]}
                                    <BoltIcon className="w-3 h-3" />
                                </div>
                                <div className="flex justify-center items-center m-1 mx-2">
                                    <WalletIcon className="w-3 h-3 mr-1 opacity-50" />
                                    <div className="font-semibold">{p?.setup?.setup?.wallet_percentage_per_transaction}%</div>
                                </div>
                                {Object.keys(p?.setup?.setup?.params ?? {}).map((k) => {
                                    const paramName = k as StrategyParams
                                    const param = p?.setup?.setup?.params[paramName]
                                    if (param === undefined) return null
                                    return <div key={k} className="flex w-auto m-1 mx-2">
                                        <div className="opacity-50">{StrategyParamsLabels[paramName].shortLabel}</div>
                                        <div className="font-semibold pl-1">{param}</div>
                                    </div>
                                })}
                                {lastSignal != null && <div className="flex w-auto m-1 mx-2 space-x-1">
                                    <div className="opacity-50">SIGNAL</div>
                                    <div className={`font-semibold ${lastSignal == "LONG" ? "text-profits dark:text-profits-dark" : "text-losses dark:text-losses-dark"}`}>{lastSignal}</div>
                                    <div className="opacity-50">{timeAgo < TIME.MINUTE ? "Now" : timeAgo < 2 * TIME.MINUTE ? "A minute ago" : timeAgo < TIME.HOUR ? `${Math.floor(timeAgo / TIME.MINUTE)} minutes ago` : timeAgo < 2 * TIME.HOUR ? "An hour ago" : timeAgo < 2 * TIME.DAY ? `${Math.floor(timeAgo / TIME.HOUR)} hours ago` : lastSignalTs.toLocaleDateString()}</div>
                                </div>
                                }
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            {p?.onDelete &&
                                <div className="flex pl-2 opacity-75">
                                    <Button small type="outlined" icon={<TrashIcon className="flex flex-none" />} onClick={() => {
                                        p?.onDelete?.(p.setup)
                                    }} />
                                </div>
                            }
                            {p?.onCopy &&
                                <div className="flex pl-2 opacity-75">
                                    <Button small type="outlined" icon={<DocumentDuplicateIcon className="flex flex-none" />} label="Copy setup" onClick={() => {
                                        p?.onCopy?.(p.setup)
                                    }} />
                                </div>
                            }
                            {botId == "" && p?.onLink &&
                                <div className="flex pl-2 opacity-75">
                                    <Button small type="solid" icon={<LinkIcon className="flex flex-none" />} label={<div className="flex-nowrap whitespace-pre">Link bot</div>} onClick={() => {
                                        p?.onLink?.(p.setup)
                                    }} />
                                </div>
                            }
                            {p?.action}
                        </div>
                    </div>
                </Spacing>
            </div>
        </>
    )
}