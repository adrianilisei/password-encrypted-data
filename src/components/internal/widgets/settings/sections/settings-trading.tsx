"use client"

import Button from "@/components/internal/buttons/button"
import Spacing from "@/components/internal/spacing/spacing"
import { apiUpdateBinanceApiKey, apiUserDisableTradingPrevention, apiUserEnableTradingPrevention } from "@/state/actions"
import currentUserStore from "@/stores/current-user"
import { CommandLineIcon, KeyIcon } from "@heroicons/react/20/solid"
import { Flex, Switch } from "@radix-ui/themes"
import { useContext, useEffect, useState } from "react"
import { get } from "svelte/store"
import { CurrentUserI } from "types"
import PulseLoader from "../../loaders/pulse-loader"
import { LocalstateLoaderContext } from "@/components/internal/wrappers/localstate-loader"

export default function SettingsTradingSectionWidget() {

    const loading = useContext(LocalstateLoaderContext)
    const [user, userSet] = useState<CurrentUserI>(get(currentUserStore))
    const [binanceApiKey, binanceApiKeySet] = useState('')
    const [newBinanceApiKey, newBinanceApiKeySet] = useState('')
    const [binanceSecretKey, binanceSecretKeySet] = useState('')
    const [newBinanceSecretKey, newBinanceSecretKeySet] = useState('')
    const [savingKey, savingKeySet] = useState(false)
    const [tradingPrevention, tradingPreventionSet] = useState(false)
    const [newTradingPrevention, newTradingPreventionSet] = useState(false)
    const [updatingTradingPrevention, updatingTradingPreventionSet] = useState(false)

    useEffect(() => {
        function setUser() {
            userSet(get(currentUserStore))
        }
        setUser()
        const u = currentUserStore.subscribe(setUser)
        return () => {
            u()
        }
    })

    useEffect(() => {
        const apiKey = user?.private?.api?.binance?.api_key ?? ''
        const privateKey = user?.private?.api?.binance?.secret_key ?? ''
        binanceApiKeySet(apiKey)
        binanceSecretKeySet(privateKey)
        newBinanceApiKeySet(apiKey)
        newBinanceSecretKeySet(privateKey)
        const isTradingPrevention = user?.status?.trading_prevention ?? false
        tradingPreventionSet(isTradingPrevention)
        newTradingPreventionSet(isTradingPrevention)
    }, [user])

    async function saveKey() {
        if (binanceApiKey == newBinanceApiKey && binanceSecretKey == newBinanceSecretKey) return
        savingKeySet(true)

        const res = await apiUpdateBinanceApiKey(newBinanceApiKey, newBinanceSecretKey)
        if (res.success) {
            currentUserStore.set({
                ...user!,
                private: {
                    api: {
                        binance: {
                            api_key: newBinanceApiKey,
                            secret_key: newBinanceSecretKey
                        }
                    }
                }
            })
        }

        savingKeySet(false)
    }

    async function updateTradingPrevention(preventTrading: boolean) {
        if (updatingTradingPrevention) return

        updatingTradingPreventionSet(true)
        newTradingPreventionSet(preventTrading)

        const res = await (preventTrading
            ? apiUserEnableTradingPrevention()
            : apiUserDisableTradingPrevention())

        if (res.success) {
            currentUserStore.set({
                ...user!,
                status: {
                    ...user!.status,
                    trading_prevention: preventTrading
                }
            })
            tradingPreventionSet(preventTrading)
        }

        updatingTradingPreventionSet(false)
    }

    return <div className="flex flex-col w-full">
        <div className="flex w-full border-b border-border dark:border-border-dark">
            <Spacing autoScale="xl">
                <div className="flex items-center text-xl font-semibold opacity-50">
                    <CommandLineIcon className="w-5 h-5 mr-2" />
                    Trading</div>
            </Spacing>
        </div>
        {loading ? <PulseLoader /> :
            <div className="flex w-full">
                <Spacing autoScale="xl">
                    <div className="flex flex-col w-full">
                        <div className="text-sm mt-4 first-of-type:mt-0 mb-2 opacity-50">Binance API Key</div>
                        <div className="flex w-full justify-center items-center relative">
                            <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                <KeyIcon className="w-full h-full" />
                            </div>
                            <input
                                className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark"
                                value={newBinanceApiKey}
                                onChange={(e) => {
                                    newBinanceApiKeySet(e.target.value)
                                }}
                                disabled={savingKey}
                                placeholder="API Key"
                                type="text"
                            />
                        </div>
                        <div className="flex w-full justify-center items-center relative mt-2">
                            <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                <KeyIcon className="w-full h-full" />
                            </div>
                            <input
                                className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark"
                                value={newBinanceSecretKey}
                                onChange={(e) => {
                                    newBinanceSecretKeySet(e.target.value)
                                }}
                                disabled={savingKey}
                                placeholder="Secret Key"
                                type="text"
                            />
                        </div>
                        <div className="flex w-full justify-center items-center relative my-4 opacity-75">
                            {(binanceApiKey != newBinanceApiKey || binanceSecretKey != newBinanceSecretKey) &&
                                <Button
                                    loading={savingKey}
                                    label="Save API Key"
                                    onClick={saveKey}
                                />
                            }
                        </div>
                        <div className="text-sm mt-4 first-of-type:mt-0 mb-2 opacity-50">Trading activity</div>
                        <div className="flex w-full items-start text-sm leading-none">
                            <label>
                                <Flex>
                                    <Switch checked={newTradingPrevention} disabled={updatingTradingPrevention} onCheckedChange={(c) => {
                                        updateTradingPrevention(c)
                                    }} radius="full" />
                                    <div className="flex flex-col ml-2 opacity-75">
                                        <div>Prevent all bots from trading</div>
                                        <div className="flex text-xs leading-normal opacity-75">
                                            This will temporarily disable the ability of your bots to open new trades.
                                        </div>
                                    </div>
                                </Flex>
                            </label>
                        </div>
                    </div>
                </Spacing>
            </div>}
    </div>
}
