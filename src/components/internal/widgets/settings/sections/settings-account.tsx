"use client"

import Button from "@/components/internal/buttons/button"
import Spacing from "@/components/internal/spacing/spacing"
import { apiUpdateUserEmail, apiUpdateUserName, loadSessionAndLocalData, setLocalData } from "@/state/actions"
import currentUserStore from "@/stores/current-user"
import { AtSymbolIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon, UserCircleIcon } from "@heroicons/react/20/solid"
import { MD5 } from "crypto-js"
import { useContext, useEffect, useRef, useState } from "react"
import { get } from "svelte/store"
import { CurrentUser, CurrentUserI } from "types"
import PulseLoader from "../../loaders/pulse-loader"
import { LocalstateLoaderContext } from "@/components/internal/wrappers/localstate-loader"
import { useToast } from "@/components/ui/use-toast"
import { Avatar } from "@radix-ui/themes"

export default function SettingsAccountSectionWidget() {

    const { toast } = useToast()
    const loading = useContext(LocalstateLoaderContext)
    const [user, userSet] = useState<CurrentUserI>(get(currentUserStore))
    const [savingName, savingNameSet] = useState(false)
    const [name, nameSet] = useState(user?.name ?? '')
    const [updatingEmailActive, updatingEmailActiveSet] = useState(false)
    const sendingTokenToNewEmailRef = useRef(false)
    const [sendingTokenToNewEmail, sendingTokenToNewEmailSet] = useState(false)
    const [tokenSentToNewEmail, tokenSentToNewEmailSet] = useState(false)
    const savingNewEmailRef = useRef(false)
    const [savingNewEmail, savingNewEmailSet] = useState(false)
    const [newEmail, newEmailSet] = useState('')
    const [currentEmailTokenCode, currentEmailTokenCodeSet] = useState('')
    const [newEmailTokenCode, newEmailTokenCodeSet] = useState('')

    useEffect(() => {
        function setUser() {
            userSet(get(currentUserStore))
        }
        setUser()

        const u = currentUserStore.subscribe(setUser)

        return () => {
            u()
        }
    }, [])

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

    useEffect(() => {
        nameSet(user?.name ?? '')
    }, [user])

    async function saveName() {
        if (name == (user?.name ?? '')) return
        savingNameSet(true)
        const res = await apiUpdateUserName(name)
        if (res.success) {
            const newUser = new CurrentUser({ ...user, name })
            await setLocalData(newUser)
            await loadSessionAndLocalData()
        } else {
            //:TODO cannot update name
        }
        savingNameSet(false)
    }

    async function verifyNewEmail() {
        if (sendingTokenToNewEmailRef.current) return
        sendingTokenToNewEmailRef.current = true
        sendingTokenToNewEmailSet(sendingTokenToNewEmailRef.current)

        const res = await apiUpdateUserEmail(newEmail, true, "", "")
        if (res.success) {
            tokenSentToNewEmailSet(true)
        } else {
            toast({ title: "Failed to generate codes", description: res.error })
        }

        sendingTokenToNewEmailRef.current = false
        sendingTokenToNewEmailSet(sendingTokenToNewEmailRef.current)
    }

    async function saveNewEmail() {
        if (savingNewEmailRef.current) return
        savingNewEmailRef.current = true
        savingNewEmailSet(savingNewEmailRef.current)

        const res = await apiUpdateUserEmail(newEmail, false, currentEmailTokenCode, newEmailTokenCode)
        if (res.success) {
            toast({ title: "Email updated" })
            userSet({ ...user, email: newEmail })
            tokenSentToNewEmailSet(false)
            newEmailSet("")
            updatingEmailActiveSet(false)
            const newUser = new CurrentUser({ ...user, email: newEmail })
            await setLocalData(newUser)
            await loadSessionAndLocalData()
        } else {
            toast({ title: "Failed to update email", description: res.error })
        }

        savingNewEmailRef.current = false
        savingNewEmailSet(savingNewEmailRef.current)
    }

    return <div className="flex flex-col w-full">
        <div className="flex w-full border-b border-border dark:border-border-dark">
            <Spacing autoScale="xl">
                <div className="flex items-center text-xl font-semibold opacity-50">
                    <UserCircleIcon className="w-5 h-5 mr-2" />
                    Account</div>
            </Spacing>
        </div>
        {loading ? <PulseLoader /> :
            <div className="flex w-full">
                <Spacing autoScale="xl">
                    <div className="flex flex-col w-full">
                        <div className="text-sm mt-4 first-of-type:mt-0 mb-2 opacity-50">Profile picture</div>
                        <div className="flex mx-auto">
                            <Avatar
                                src={showGravatarPic ? pictureUrl : undefined}
                                fallback={<div className="flex w-full h-full border border-border dark:border-border-dark rounded-full bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('/icons/logo/logo-2x1.png')" }} />
                                }
                                radius="full"
                                size="8"
                            />
                        </div>
                        <div className="flex w-full justify-center mt-2">
                            <a
                                href="https://en.gravatar.com"
                                target="_blank"
                                className="inline underline text-xs opacity-50">Update picture on Gravatar</a
                            >
                        </div>
                        <div className="text-sm mt-4 first-of-type:mt-0 mb-2 opacity-50">Name</div>
                        <div className="flex w-full justify-center items-center relative">
                            <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                <UserCircleIcon className="w-full h-full" />
                            </div>
                            <input
                                className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark"
                                value={name}
                                onChange={(e) => {
                                    nameSet(e.target.value)
                                }}
                                placeholder="Name"
                                disabled={savingName}
                            />
                        </div>
                        {name != (user?.name ?? '') &&
                            <div className="flex w-full justify-center items-center relative my-4">
                                <Button label="Save name" loading={savingName} onClick={saveName} />
                            </div>
                        }
                        < div className="flex items-end space-x-2 text-sm mt-4 first-of-type:mt-0 mb-2">
                            <div className="opacity-50">Email</div>
                            {!updatingEmailActive &&
                                <div>
                                    <Button xs type="soft" roundedFull label="Update" onClick={() => {
                                        updatingEmailActiveSet(true)
                                    }} />
                                </div>
                            }
                        </div>
                        <div className="flex w-full justify-center items-center relative">
                            <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                <AtSymbolIcon className="w-full h-full" />
                            </div>
                            <input
                                className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark disabled:opacity-50"
                                value={user?.email ?? ''}
                                placeholder="Email"
                                disabled
                            />
                        </div>
                        {updatingEmailActive && <>
                            <div className="flex w-full justify-center items-center relative mt-2">
                                <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                    <AtSymbolIcon className="w-full h-full" />
                                </div>
                                <input
                                    className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark disabled:opacity-50"
                                    value={newEmail ?? ''}
                                    onChange={(e) => {
                                        newEmailSet(e.target.value)
                                    }}
                                    placeholder="New email"
                                    disabled={sendingTokenToNewEmail || tokenSentToNewEmail}
                                />
                            </div>
                            {!tokenSentToNewEmail && newEmail != "" && newEmail != user?.email &&
                                <div className="flex w-full justify-center items-center relative my-4">
                                    <Button icon={<LockClosedIcon className="flex w-full h-full" />} label={"Verify new email"} loading={sendingTokenToNewEmail} onClick={verifyNewEmail} />
                                </div>
                            }
                            {tokenSentToNewEmail &&
                                <div className="flex w-full justify-start items-center relative mt-4 text-xs opacity-50">
                                    Two verification codes were sent to your current and new email addresses.
                                </div>
                            }
                            {tokenSentToNewEmail &&
                                <div className="flex w-full justify-center items-center relative mt-2">
                                    <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                        <LockClosedIcon className="w-full h-full" />
                                    </div>
                                    <input
                                        className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark disabled:opacity-50"
                                        value={currentEmailTokenCode ?? ''}
                                        onChange={(e) => {
                                            currentEmailTokenCodeSet(e.target.value)
                                        }}
                                        placeholder="Current email verification code"
                                        disabled={savingNewEmail}
                                    />
                                </div>
                            }
                            {tokenSentToNewEmail &&
                                <div className="flex w-full justify-center items-center relative mt-2">
                                    <div className="flex absolute left-2 w-4 h-4 opacity-50">
                                        <LockClosedIcon className="w-full h-full" />
                                    </div>
                                    <input
                                        className="flex w-full p-2 pl-8 text-sm rounded bg-floating-foreground/5 dark:bg-floating-foreground-dark/10 border border-border dark:border-border-dark disabled:opacity-50"
                                        value={newEmailTokenCode ?? ''}
                                        onChange={(e) => {
                                            newEmailTokenCodeSet(e.target.value)
                                        }}
                                        placeholder="New email verification code"
                                        disabled={savingNewEmail}
                                    />
                                </div>
                            }
                            {tokenSentToNewEmail && newEmail != "" && newEmail != user?.email && currentEmailTokenCode != '' && newEmailTokenCode != '' &&
                                <div className="flex w-full justify-center items-center relative my-4">
                                    <Button icon={<ShieldCheckIcon className="flex w-full h-full" />} label={"Save new email"} loading={savingNewEmail} onClick={saveNewEmail} />
                                </div>
                            }
                        </>
                        }
                    </div>
                </Spacing>
            </div>
        }
    </div>
}
