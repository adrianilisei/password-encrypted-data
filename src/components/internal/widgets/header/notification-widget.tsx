"use client"

import Button from "../../buttons/button"
import Spacing from "../../spacing/spacing"
import { ReactNode, useEffect, useRef, useState } from "react"
import { NotificationType, type NotificationI } from "types"
import { userGetNotifications } from "@/state/actions"
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, BellAlertIcon, BellIcon, CheckIcon, CurrencyDollarIcon, RectangleStackIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/20/solid"
import { useQuery } from "react-query"
import PulseWavesLoader from "../loaders/pulse-waves-loader"

export default function HeaderNotificationWidget() {

    const [unread, unreadSet] = useState(0)
    const { data: notifications, error, isLoading } = useQuery({
        cacheTime: 0,
        staleTime: 0,
        queryKey: "notifications-v2",
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const res = await userGetNotifications()
            const notifications = ((res.data as Record<string, unknown>)?.['notifications'] as NotificationI[]) ?? []
            return notifications
        },
        onSettled: (notifications) => {
            if (!notifications) return
            let unread = 0
            for (let i = 0; i < notifications.length; i++) {
                const notification = notifications[i]
                if (!(Object(notification?.['status'])?.['seen'] ?? false)) unread++
            }
            unreadSet(unread)
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

    return <div className="flex items-center text-sm font-semibold relative">
        <div className="flex opacity-50">
            <Button roundedFull type="ghost" icon={(unread ?? 0) > 0 ? <div className="relative w-full h-full">
                <BellAlertIcon />
                <div
                    className="absolute top-0 right-0 w-2 h-2 bg-red-500 border border-surface dark:border-surface-dark rounded-full"
                />
            </div> : <BellIcon />} label={(unread ?? 0) > 0 ? unread.toString() : ''}
                onClick={(e) => {
                    e?.stopPropagation?.()
                    preventHidingOverlay(toggleOverlay)
                }} />
        </div>
        {isOverlayVisible &&
            <div
                onClick={(e) => {
                    preventHidingOverlay(showOverlay)
                }}
                // transition:fly={{ y: 25, duration: 250 }}
                className="flex flex-col absolute top-[calc(100%+12px)] right-0 w-[350px] max-w-[90vw] h-[600px] max-h-[90vh] bg-floating dark:bg-floating-dark border border-border dark:border-border-dark shadow-xl rounded-xl overflow-auto cursor-default"
            >
                <Spacing notLeft notRight autoScale="lg">
                    <div className="flex flex-col w-full">
                        {isLoading || error ?
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
                            !notifications || (notifications?.length ?? 0) <= 0 ?
                                <Spacing autoScale="lg">
                                    <div
                                        className="flex w-full justify-center items-center flex-col text-md font-medium opacity-50 mt-6"
                                    >
                                        <div>No notifications yet</div>
                                        <RectangleStackIcon className="w-10 h-10 mt-6 opacity-75" />
                                    </div>
                                </Spacing>
                                : <>
                                    {notifications.map((n) => {
                                        return <div
                                            key={n._id}
                                            data-seen={n?.status?.seen ?? false}
                                            data-won={n?.data?.transaction?.won ?? false}
                                            data-lost={n?.data?.transaction?.lost ?? false}
                                            data-received={n?.type == NotificationType['TOKEN-RECEIVED']}
                                            className="flex items-center group w-full relative border-t last:border-b border-border-dim dark:border-border-dim-dark hover:bg-border-dim dark:hover:bg-border-dim-dark cursor-default"
                                        >
                                            <div className="hidden absolute left-0 h-full w-1 group-data-[seen=false]:flex">
                                                <Spacing notLeft notRight fullHeight autoScale="lg">
                                                    <div
                                                        className="flex h-full w-full bg-primary/50 dark:bg-primary-dark/50 rounded-r-full"
                                                    />
                                                </Spacing>
                                            </div>
                                            <Spacing autoScale="lg">
                                                <div className="flex w-full">
                                                    <div
                                                        className="flex grow-0 shrink-0 relative justify-center items-center w-6 h-6 rounded-full bg-border-dim dark:bg-border-dim-dark group-data-[won=true]:bg-profits/40 group-data-[won=true]:dark:bg-profits-dark/40 group-data-[lost=true]:bg-losses/40 group-data-[lost=true]:dark:bg-losses-dark/40 border border-border/50 dark:border-border-dark/50"
                                                    >
                                                        {
                                                            ({
                                                                [NotificationType['REFERRAL-EARN']]:
                                                                    <div className="flex justify-center w-full h-full relative">
                                                                        <CurrencyDollarIcon className="w-full h-full opacity-75" />
                                                                    </div>,
                                                                [NotificationType['TRADE-OPEN']]:
                                                                    <div>
                                                                        {Object(n.data?.['transaction'])?.['side'] == 'LONG'
                                                                            ? <ArrowTrendingUpIcon className="w-3.5 h-3.5 opacity-75" />
                                                                            : <ArrowTrendingDownIcon className="w-3.5 h-3.5 opacity-75" />}

                                                                    </div>,
                                                                [NotificationType['TRADE-CLOSE']]:
                                                                    <div>
                                                                        {n.data?.['transaction']?.['won']
                                                                            ? <CheckIcon className="w-3.5 h-3.5 opacity-75" />
                                                                            : <XMarkIcon className="w-3.5 h-3.5 opacity-75" />}
                                                                    </div>,
                                                                [NotificationType['TOKEN-RECEIVED']]:
                                                                    <div className="flex justify-center w-full h-full relative">
                                                                        <CurrencyDollarIcon className="w-full h-full opacity-75" />
                                                                    </div>,
                                                                [NotificationType['TOKEN-SENT']]:
                                                                    <div className="flex justify-center w-full h-full relative">
                                                                        <CurrencyDollarIcon className="w-full h-full opacity-75" />
                                                                    </div>
                                                            } as Record<NotificationType, ReactNode>)[n.type]
                                                        }
                                                    </div>
                                                    <div className="flex flex-col w-full px-2">
                                                        <div
                                                            className="flex w-full text-sm leading-none font-semibold group-data-[seen=true]:font-normal opacity-60"
                                                        >{
                                                                ({
                                                                    [NotificationType['REFERRAL-EARN']]: "New earnings",
                                                                    [NotificationType['TRADE-OPEN']]: "New trade opened",
                                                                    [NotificationType['TRADE-CLOSE']]: "Trade closed",
                                                                    [NotificationType['TOKEN-RECEIVED']]: "Tokens received"
                                                                } as Record<NotificationType, ReactNode>)[n.type]
                                                            }
                                                        </div>
                                                        <div
                                                            className="flex flex-col w-full mt-1 text-xs leading-normal font-normal opacity-50"
                                                        >
                                                            {
                                                                ({
                                                                    [NotificationType['REFERRAL-EARN']]:
                                                                        "You just earned " + (n.data?.['amount'] !== undefined ? `$${n.data?.['amount'].toFixed(2).toLocaleString()}` : "some tokens") + " from your referrals",
                                                                    [NotificationType['TRADE-OPEN']]:
                                                                        (n.data?.['transaction']?.['side'] == 'LONG' ? 'LONG' : 'SHORT') + "position just opened",
                                                                    [NotificationType['TRADE-CLOSE']]:
                                                                        "A trade reached" + (n.data?.['transaction']?.['won']
                                                                            ? 'take profit'
                                                                            : 'stop loss') + "target",
                                                                    [NotificationType['TOKEN-RECEIVED']]:
                                                                        <div className="block w-full">
                                                                            You received{n.data?.amount != undefined ? ' $' : ' '}{n.data?.amount ??
                                                                                'some tokens'}{" from "}
                                                                            {n.data?.from_user?.name ?
                                                                                <><span className="inline font-bold">{n.data?.from_user?.name}</span>.</>
                                                                                :
                                                                                "someone."
                                                                            } For more details go to transactions page.
                                                                        </div>
                                                                } as Record<NotificationType, ReactNode>)[n.type]
                                                            }
                                                        </div>
                                                        <div className="flex w-full mt-1 text-[10px] leading-none font-light opacity-50">
                                                            {Date.now() - new Date((n?.timestamps?.created ?? (new Date()))).getTime() < 24 * 60 * 60 * 1000 ?
                                                                (new Date((n?.timestamps?.created ?? (new Date()))).toLocaleTimeString())
                                                                :
                                                                (new Date((n?.timestamps?.created ?? (new Date()))).toDateString())
                                                            }
                                                        </div>
                                                    </div>
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
