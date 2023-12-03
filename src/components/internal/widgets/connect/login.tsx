"use client"

import Spacing from "@/components/internal/spacing/spacing"
import { userLogin } from "@/state/actions"
import currentUserStore from "@/stores/current-user"
import { useEffect, useId, useState } from "react"
import { get } from "svelte/store"
import { ApiJsonResponse, CurrentUserI, User } from "types"
import Button from "../../buttons/button"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function ConnectLoginWidget(p: { onConnectEmailChange: (email: string) => void, connectEmail?: string, disconnected?: boolean, register: () => void, recover: () => void }) {

  const id = useId()
  const { toast } = useToast()
  const checboxId = useId()
  const [user, userSet] = useState<CurrentUserI>()
  const [logoutEverywhere, logoutEverywhereSet] = useState(false)
  const [connecting, connectingSet] = useState(false)
  const [errorOnEmail, errorOnEmailSet] = useState(false)
  const [errorOnPassword, errorOnPasswordSet] = useState(false)
  const [email, emailSet] = useState(p?.connectEmail ?? "")
  const [password, passwordSet] = useState("")

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

  async function login(): Promise<void> {
    try {
      if (connecting) return

      errorOnEmailSet(false)
      errorOnPasswordSet(false)

      if ((email ?? '') == '' || (password ?? '') == '') {
        errorOnEmailSet((email ?? '') == '')
        errorOnPasswordSet((password ?? '') == '')
        toast({ title: 'Please fill all the fields!' })
        return
      }

      connectingSet(true)
      const response: ApiJsonResponse = await userLogin(email, password, logoutEverywhere)

      if (response.success) {
        window.location.href = "/dashboard"
        return
      } else {
        toast({ title: 'Login failed', description: response.error })
      }
      connectingSet(false)
    } catch (error) {
      toast({ title: 'Login failed', description: "Couldn't connect to the server." })
      connectingSet(false)
    }
  }

  function onRegisterLink(e?: { preventDefault: () => void }) {
    p.register()
    e?.preventDefault()
  }

  function onRecoverLink(e?: { preventDefault: () => void }) {
    p.recover()
    e?.preventDefault()
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <h1 className="flex mb-12 text-center text-lg font-bold">Login to account</h1>
        {p.disconnected &&
          <div
            className="flex mb-6 p-4 text-xs font-semibold rounded-xl bg-losses/75 dark:bg-losses-dark/75 text-losses-text dark:text-losses-text-dark"
          >
            You have been disconnected. Please login again to your account!
          </div>
        }
        {user?.is_connected &&
          <div className="flex w-full mb-6">
            <Button
              theme="primary"
              large
              label={<div className="flex">
                <div className="opacity-75">Continue as</div>&nbsp;<div className="font-bold">{user?.name ?? user?.email ?? "No name"}</div>
              </div>}
              href="/"
              icon={<div
                style={{
                  backgroundImage: `url('${User.getGravatarPictureUrl(user?.email) ??
                    ''}')`
                }}
                className={`flex w-full h-full rounded-full bg-center bg-cover scale-125 -translate-x-2 border border-primary dark:border-primary-dark ring-1 ring-primary-foreground/50 dark:ring-primary-foreground-dark/50`}
              />}
            >
            </Button>
          </div>
        }
        < form >
          <input
            value={email}
            onChange={(e) => {
              emailSet(e.target.value)
              p.onConnectEmailChange(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") document.getElementById(`${id}-password`)?.focus?.()
            }}
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            title="Email"
            className="no-input-appearance flex w-full py-2 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none
					{errorOnEmail ? 'border-primary dark:border-primary-dark' : ''}"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => passwordSet(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") login()
            }}
            id={`${id}-password`}
            type="password"
            className="no-input-appearance flex w-full py-2 mt-4 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none
					{errorOnPassword ? 'border-primary dark:border-primary-dark' : ''}"
            placeholder="Password"
          />
          <Spacing notLeft notRight>
            <div className="flex w-full justify-start items-center">
              <Checkbox id={checboxId} checked={logoutEverywhere} onCheckedChange={(c) => logoutEverywhereSet(c == "indeterminate" ? false : c)} />
              <label htmlFor={checboxId} className="text-text/50 dark:text-text-dark/50 ml-1">
                Disconnect from other devices
              </label>
            </div>
          </Spacing >
          <Spacing notLeft notRight>
            <Button label="Connect" onClick={login} loading={connecting} />
          </Spacing>
          <Spacing notLeft notRight>
            <Button label="Create an account" onClick={() => { onRegisterLink() }} type="ghost" small />
          </Spacing>
          <Spacing notLeft notRight>
            <Button label="Reset my password" onClick={() => { onRecoverLink() }} type="ghost" small />
          </Spacing>
        </form>
      </div>
    </>
  )
}