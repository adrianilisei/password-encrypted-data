"use client"

import Button from "@/components/internal/buttons/button"
import Spacing from "@/components/internal/spacing/spacing"
import { apiChangePassword, apiUserDisconnectSessions, apiUserSessions } from "@/state/actions"
import currentUserStore from "@/stores/current-user"
import { ArchiveBoxXMarkIcon, FingerPrintIcon, LockClosedIcon } from "@heroicons/react/20/solid"
import { MD5 } from "crypto-js"
import { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { get } from "svelte/store"
import { CurrentUserI } from "types"
import PulseLoader from "../../loaders/pulse-loader"
import { LocalstateLoaderContext } from "@/components/internal/wrappers/localstate-loader"
import { TIME } from "utilities"

interface SessionI {
    current: boolean
    token: string
    timestamps: {
        created: Date
        online: Date
    }
}

export default function SettingsSecuritySectionWidget() {

    const loading = useContext(LocalstateLoaderContext)
    const [sessions, sessionsSet] = useState<SessionI[]>([])
    const { error: errorSessions, isLoading: loadingSessions, refetch: refetchSessions } = useQuery({
        cacheTime: 0,
        staleTime: TIME.HOUR,
        refetchOnWindowFocus: false,
        queryKey: "sessions",
        queryFn: async () => {
            const res = await apiUserSessions()
            sessionsSet(((res?.data ?? []) as SessionI[]))
            return res
        }
    })

    const [user, userSet] = useState<CurrentUserI>(get(currentUserStore))
    const [currentPassword, currentPasswordSet] = useState('')
    const [newPassword, newPasswordSet] = useState('')
    const [confirmNewPassword, confirmNewPasswordSet] = useState('')
    const [changingPassword, changingPasswordSet] = useState(false)
    const [disconnecting, disconnectingSet] = useState(false)
    const [canSaveNewPassword, canSaveNewPasswordSet] = useState(false)
    const [currentSession, currentSessionSet] = useState<SessionI>({
        current: true,
        token: user?.session_token ?? '',
        timestamps: {
            created: new Date(),
            online: new Date()
        }
    })

    useEffect(() => {
        function setUser() { userSet(get(currentUserStore)) }
        setUser()
        const u = currentUserStore.subscribe(setUser)
        return () => { u() }
    }, [])

    const setCurrentSession = () => {
        currentSessionSet({
            current: true,
            token: user?.session_token ?? '',
            timestamps: {
                created: new Date(),
                online: new Date()
            }
        })
    }

    useEffect(() => {
        setCurrentSession()
    }, [user])

    useEffect(() => {
        canSaveNewPasswordSet(
            MD5(currentPassword).toString() == user?.password &&
            newPassword.length >= 8 &&
            newPassword.length <= 50 &&
            newPassword == confirmNewPassword &&
            newPassword != currentPassword)
    }, [currentPassword, newPassword, confirmNewPassword, user])

    async function changePassword() {
        if (!canSaveNewPassword) return
        changingPasswordSet(true)
        await apiChangePassword(currentPassword, newPassword)
        changingPasswordSet(false)
    }

    async function disconnect() {
        disconnectingSet(true)
        const res = await apiUserDisconnectSessions()
        if (res.success) {
            sessionsSet([])
            refetchSessions()
        }
        disconnectingSet(false)
    }

    return <div className="flex flex-col w-full">
        <div className="flex w-full border-b border-border dark:border-border-dark">
            <Spacing autoScale="xl">
                <div className="flex items-center text-xl font-semibold opacity-50">
                    <LockClosedIcon className="w-5 h-5 mr-2" />
                    Security</div>
            </Spacing>
        </div>
        {loading ? <PulseLoader /> :
            <div className="flex w-full">
                <Spacing autoScale="xl">
                    <div className="flex flex-col w-full">
                        <div className="text-sm mt-4 first-of-type:mt-0 mb-2 opacity-50">Password</div>
                        <div className="flex w-full justify-center items-center relative">
                            <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                <FingerPrintIcon className="w-full h-full" />
                            </div>
                            <input
                                className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark"
                                value={currentPassword}
                                onChange={(e) => { currentPasswordSet(e.target.value) }}
                                placeholder="Current password"
                                type="password"
                            />
                        </div>
                        <div className="flex w-full justify-center items-center relative mt-2">
                            <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                <FingerPrintIcon className="w-full h-full" />
                            </div>
                            <input
                                className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark"
                                value={newPassword}
                                onChange={(e) => { newPasswordSet(e.target.value) }}
                                placeholder="New password"
                                type="password"
                            />
                        </div>
                        <div className="flex w-full justify-center items-center relative mt-2">
                            <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                <FingerPrintIcon className="w-full h-full" />
                            </div>
                            <input
                                className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark"
                                value={confirmNewPassword}
                                onChange={(e) => { confirmNewPasswordSet(e.target.value) }}
                                placeholder="Confirm new password"
                                type="password"
                            />
                        </div>
                        {canSaveNewPassword &&
                            <div className="flex w-full justify-center items-center relative my-4 opacity-75">
                                <Button
                                    loading={changingPassword}
                                    label="Update password"
                                    onClick={changePassword}
                                />
                            </div>
                        }
                        <div className="text-sm mt-4 first-of-type:mt-0 mb-2 opacity-50">Login sessions</div>
                        <div className="grid grid-cols-1 gap-1">
                            {[currentSession, ...((sessions ?? []).filter((s) => (s?.token ?? '') != currentSession?.token))].map((session) => {
                                if (!session) return
                                return <div key={session.token}
                                    className="flex flex-wrap w-full items-center p-4 text-xs leading-none rounded bg-border/75 dark:bg-border-dark/75"
                                >
                                    <div className="flex flex-wrap items-center -m-1">
                                        {session?.current && <>
                                            <div
                                                className="flex w-2 h-2 m-1 rounded-full bg-primary/75 dark:bg-primary-dark/75"
                                            />
                                            <div
                                                className="flex m-1 opacity-50 text-xs font-semibold leading-none p-0.5 border border-on-surface/50 dark:border-on-surface-dark/50 rounded"
                                            >
                                                Current device
                                            </div>
                                        </>
                                        }
                                        < div className="flex m-1 opacity-50 text-xs leading-none">
                                            Online:&nbsp;
                                            <div className="inline font-semibold">
                                                {new Date(session.timestamps.online).toDateString()}
                                                {new Date(session.timestamps.online).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="flex m-1 opacity-50 text-xs leading-none">
                                            Connected:&nbsp;
                                            <div className="inline font-semibold">
                                                {new Date(session.timestamps.created).toDateString()}
                                                {new Date(session.timestamps.created).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                            }

                            {(loadingSessions || !!errorSessions) &&
                                <div className="text-xs opacity-50">{loadingSessions ? "Loading other sessions..." : "There was an error while loading other sessions"}</div>
                            }
                        </div>
                        {sessions.length > 0 &&
                            <div className="flex w-full justify-center items-center relative my-4 opacity-75">
                                <Button
                                    type="outlined"
                                    label="Disconnect all other devices"
                                    loading={disconnecting}
                                    onClick={disconnect}
                                    icon={<ArchiveBoxXMarkIcon />}
                                >
                                </Button>
                            </div>
                        }
                    </div>
                </Spacing>
            </div>}
    </div>
}
