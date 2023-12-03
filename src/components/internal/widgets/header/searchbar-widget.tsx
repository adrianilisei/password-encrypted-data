"use client"

import Spacing from "../../spacing/spacing"
import { useEffect, useRef, useState } from "react"
import { type NotificationI, STRATEGIES_LABELLED } from "types"
import { userGetNotifications } from "@/state/actions"
import { MagnifyingGlassIcon, RectangleStackIcon, XCircleIcon } from "@heroicons/react/20/solid"
import { useQuery } from "react-query"
import PulseWavesLoader from "../loaders/pulse-waves-loader"
import { useRouter } from "next/navigation"

interface SearchResultI {
    type: 'strategy' | 'market'
    label: string
    id: string
}

const getResults = (): SearchResultI[] => {
    return STRATEGIES_LABELLED.map((s) => {
        return {
            type: 'strategy',
            label: s.label,
            id: s.id
        }
    })
}

export default function HeaderSearchbarWidget() {

    const router = useRouter()
    const [search, searchSet] = useState("")
    const [results, resultsSet] = useState<SearchResultI[]>(getResults())
    const [notifications, notificationsSet] = useState<NotificationI[]>([])
    const { error, isLoading } = useQuery({
        cacheTime: 0,
        staleTime: 0,
        queryKey: "notifications",
        queryFn: async () => {
            const res = await userGetNotifications()
            const notifications = ((res.data as Record<string, unknown>)?.['notifications'] as NotificationI[]) ?? []
            notificationsSet(notifications)
            return res
        }
    })

    const [tabIndex, tabIndexSet] = useState(0)
    const [isOverlayVisible, isOverlayVisibleSet] = useState(false)
    const isPreventingOverlayHiding = useRef(false)

    function showOverlay() {
        isOverlayVisibleSet(true)
    }

    function hideOverlay() {
        if (isPreventingOverlayHiding.current) return
        isOverlayVisibleSet(false)
    }

    function toggleOverlay() {
        isOverlayVisibleSet((v) => !v)
    }

    function preventHidingOverlay(callback?: () => any) {
        isPreventingOverlayHiding.current = true
        callback?.()
        setTimeout(() => {
            isPreventingOverlayHiding.current = false
        }, 50)
    }

    useEffect(() => {
        document.addEventListener("click", hideOverlay)
        return () => {
            document.removeEventListener("click", hideOverlay)
        }
    }, [])

    return <div className="flex relative justify-start items-center w-full">
        <input
            value={search}
            onChange={(e) => {
                searchSet(e.target.value)
            }}
            onFocus={(e) => {
                preventHidingOverlay(showOverlay)
            }}
            onClick={(e) => {
                e.stopPropagation()
                preventHidingOverlay(showOverlay)
            }}
            className="flex w-full h-8 text-sm bg-surface-foreground/5 dark:bg-surface-foreground-dark/20 p-2 pl-7 rounded-lg"
            placeholder="Search strategies and markets..."

        />
        <div className="flex absolute left-2 w-4 h-4 opacity-25">
            <MagnifyingGlassIcon />
        </div>
        {isOverlayVisible &&
            <div
                onClick={(e) => {
                    preventHidingOverlay(showOverlay)
                }}
                className="flex flex-col absolute top-[calc(100%+12px)] w-full h-[400px] max-h-[90vh] bg-floating dark:bg-floating-dark border border-border dark:border-border-dark shadow-xl rounded-xl overflow-auto cursor-default"
            >
                <Spacing notLeft notRight autoScale="lg">
                    <div className="flex flex-col w-full">
                        {(isLoading || error) && false ?
                            <Spacing autoScale="lg">
                                {isLoading ?
                                    <div
                                        className="flex w-full justify-center items-center flex-col text-md font-medium  mt-6"
                                    >
                                        <div className="opacity-50">Loading notifications...</div>
                                        <div className="w-10 h-10 mt-6">
                                            <PulseWavesLoader small />
                                        </div>
                                    </div>
                                    :
                                    <div
                                        className="flex w-full justify-center items-center flex-col text-md font-medium opacity-50 mt-6"
                                    >
                                        <div>Failed to load notifications</div>
                                        <div className="w-10 h-10 mt-6 opacity-75">
                                            <XCircleIcon />
                                        </div>
                                    </div>
                                }
                            </Spacing>
                            :

                            notifications.length <= 0 && false ?
                                <Spacing autoScale="lg">
                                    <div
                                        className="flex w-full justify-center items-center flex-col text-md font-medium opacity-50 mt-6"
                                    >
                                        <div>No notifications yet</div>
                                        <RectangleStackIcon className="w-10 h-10 mt-6 opacity-75" />
                                    </div>
                                </Spacing>
                                : <>
                                    {results.map((r) => {
                                        return <div
                                            key={r.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                hideOverlay()
                                                router.push(`/strategy/${r.id}`)
                                            }}
                                            className="flex items-center group w-full relative border-t last:border-b border-border-dim dark:border-border-dim-dark hover:bg-border-dim dark:hover:bg-border-dim-dark cursor-default"
                                        >
                                            <Spacing notTop notBottom>
                                                <div className="flex flex-col py-1">
                                                    <div className="flex text-sm font-semibold opacity-75">{r.label}</div>
                                                    <div className="flex text-xs leading-none opacity-50">{r.type == "strategy" ? 'Strategy' : r.type == "market" ? 'Market' : ""}</div>
                                                </div>
                                            </Spacing>
                                        </div>
                                    })}
                                </>
                        }
                    </div>
                </Spacing>
            </div>
        }
    </div >
}
