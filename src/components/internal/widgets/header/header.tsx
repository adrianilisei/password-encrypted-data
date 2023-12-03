"use client"

import { Avatar } from "@radix-ui/themes"
import Button from "../../buttons/button"
import MaxWidth from "../../spacing/max-width"
import Spacing from "../../spacing/spacing"
import TopBar from "../top-bar"
import { Bars3BottomLeftIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/solid'
import { formatAmount, runEvent } from 'utilities'
import { APP_EVENTS } from "@/const/app-events"
import { useContext, useEffect, useRef, useState } from "react"
import currentUserStore from "@/stores/current-user"
import type { CurrentUserI } from "types"
import { get } from "svelte/store"
import { MD5 } from 'crypto-js'
import HeaderNotificationWidget from "./notification-widget"
import { ArrowRightOnRectangleIcon, UserCircleIcon, UserIcon } from "@heroicons/react/20/solid"
import { LocalstateLoaderContext } from "../../wrappers/localstate-loader"
import { userLogout } from "@/state/actions"
import HeaderSearchbarWidget from "./searchbar-widget"
import SmallVerticalSeparator from "../../separator/small-vertical-separator"

export default function Header() {

    const loadingLocalData = useContext(LocalstateLoaderContext)
    const [user, setUser] = useState<CurrentUserI>(get(currentUserStore))

    useEffect(() => {
        function updateUser() {
            setUser(get(currentUserStore))
        }
        const unsub = currentUserStore.subscribe(updateUser)
        return function () {
            unsub()
        }
    })

    const credits = (user?.wallet?.credits ?? 0)
    const creditsLabel = formatAmount(credits)

    const [showGravatarPic, showGravatarPicSet] = useState(false)

    const hashedEmail = user?.email ?? '' != '' ? MD5((user?.email ?? '').toLowerCase()).toString() : ''
    const pictureUrl = `https://www.gravatar.com/avatar/${hashedEmail}`

    async function checkGravatar() {
        try {
            if (hashedEmail == "") return
            const req = await fetch(`https://gravatar.com/${hashedEmail}.json`)
            const res = await req.json()
            showGravatarPicSet(res != "User not found")
        } catch (error) {
            showGravatarPicSet(false)
        }
    }

    useEffect(() => {
        checkGravatar()
    }, [user])

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

    async function logout() {
        await userLogout()
        window.location.href = "/connect"
    }

    return (
        <TopBar>
            <div className={`flex justify-between w-full h-full`}>
                <Spacing notLeft notRight autoScale="base">
                    <Spacing notTop notBottom autoScale="xl">
                        <div className="flex justify-center w-full text-surface-foreground dark:text-surface-foreground-dark">
                            <MaxWidth>
                                <div className="flex w-full h-auto">
                                    <div className="flex sm:hidden opacity-50">
                                        <Spacing onlyRight>
                                            <Button roundedFull onClick={() => {
                                                runEvent(APP_EVENTS.OPEN_SIDEBAR)
                                            }} type="ghost" icon={<Bars3BottomLeftIcon />} />
                                        </Spacing>
                                    </div>
                                    <div className="flex relative justify-start items-center w-full max-w-md h-full">
                                        <HeaderSearchbarWidget />
                                    </div>
                                    <div className="flex w-auto ml-auto h-full justify-self-end items-center">
                                        <div className="flex group items-center text-sm font-semibold relative">
                                            <div className="flex justify-center items-center">
                                                <div className="flex justify-end items-center">
                                                    <Spacing onlyLeft>
                                                        <div className="flex opacity-50">
                                                            <Button href="/wallet" roundedFull type="ghost" icon={<CurrencyDollarIcon />} label={loadingLocalData ? "" : creditsLabel} />
                                                            <Button href="/earn" roundedFull type="ghost" icon={<UserGroupIcon />} label={loadingLocalData ? "" : user?.statistics?.referrals ?? 0} />
                                                        </div>
                                                        <HeaderNotificationWidget />
                                                    </Spacing>
                                                    <Spacing onlyLeft>
                                                        <div className="flex justify-center items-center w-auto h-full relative">
                                                            {loadingLocalData ?
                                                                <div className="flex justify-center items-center w-8 h-8 bg-surface-foreground text-surface dark:bg-surface-foreground-dark dark:text-surface-dark rounded-full opacity-50">
                                                                    <UserIcon className="flex w-2/3 h-2/3" />
                                                                </div>
                                                                :
                                                                <Avatar
                                                                    src={showGravatarPic ? pictureUrl : undefined}
                                                                    fallback={<div className="flex w-full h-full border border-border dark:border-border-dark rounded-full bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('/icons/logo/logo-2x1.png')" }} onClick={(e) => {
                                                                        e?.stopPropagation?.()
                                                                        preventHidingOverlay(toggleOverlay)
                                                                    }} />
                                                                    }
                                                                    radius="full"
                                                                    size="2"
                                                                    onClick={(e) => {
                                                                        e?.stopPropagation?.()
                                                                        preventHidingOverlay(toggleOverlay)
                                                                    }}
                                                                />
                                                            }
                                                            {isOverlayVisible && <div
                                                                onClick={() => {
                                                                    preventHidingOverlay(showOverlay)
                                                                }}
                                                                className="flex z-10 absolute top-[calc(100%+12px)] right-0 w-[350px] max-w-[90vw] h-auto max-h-[90vh] bg-floating dark:bg-floating-dark border border-border dark:border-border-dark shadow-xl rounded-xl cursor-default"
                                                            >
                                                                <Spacing autoScale="xl">
                                                                    <div className="flex flex-col w-full">
                                                                        <div className="flex w-full justify-center">
                                                                            <Avatar
                                                                                src={showGravatarPic ? pictureUrl : undefined}
                                                                                fallback={<div className="flex w-full h-full border border-border dark:border-border-dark rounded-full bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('/icons/logo/logo-2x1.png')" }} />
                                                                                }
                                                                                radius="full"
                                                                                size="5"
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="w-full mt-2 justify-center text-center text-sm leading-none opacity-50"
                                                                        >
                                                                            {(user?.name ?? '') != '' ?
                                                                                <div className="font-bold">{user?.name}</div>
                                                                                :
                                                                                <div className="italic">No name set</div>
                                                                            }
                                                                        </div>
                                                                        <div className="flex w-full justify-center mt-4 mb-2">
                                                                            <SmallVerticalSeparator />
                                                                        </div>
                                                                        <div className="w-full mt-2">
                                                                            <Button label="Edit profile" href="/settings/account" icon={<UserCircleIcon className="w-full h-full" />}
                                                                                onClick={(e) => {
                                                                                    e?.stopPropagation?.()
                                                                                    hideOverlay()
                                                                                }}>

                                                                            </Button>
                                                                        </div>
                                                                        <div className="w-full mt-2">
                                                                            <Button
                                                                                type="ghost"
                                                                                theme="loss"
                                                                                label="Logout"
                                                                                onClick={(e) => {
                                                                                    logout()
                                                                                    e?.stopPropagation?.()
                                                                                    hideOverlay()
                                                                                }}
                                                                                icon={<ArrowRightOnRectangleIcon className="w-full h-full" />}
                                                                            >
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </Spacing>
                                                            </div>}
                                                        </div>
                                                    </Spacing>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </MaxWidth>
                        </div>
                    </Spacing >
                </Spacing>
            </div>
        </TopBar>
    )
}
