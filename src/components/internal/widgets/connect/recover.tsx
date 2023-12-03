"use client"

import Spacing from "@/components/internal/spacing/spacing"
import { userLogin, userRecover, userRecoverGenerateToken } from "@/state/actions"
import { useState } from "react"
import { ApiJsonResponse } from "types"
import Button from "../../buttons/button"
import { useToast } from "@/components/ui/use-toast"

export default function ConnectRecoverWidget(p: { onConnectEmailChange: (email: string) => void, login: () => void, connectEmail?: string, fromLogin?: boolean, referral?: string }) {

  const { toast } = useToast()
  const [connecting, connectingSet] = useState(false)
  const [tokenGenerated, tokenGeneratedSet] = useState(false)
  const [errorOnEmail, errorOnEmailSet] = useState(false)
  const [errorOnToken, errorOnTokenSet] = useState(false)
  const [errorOnPassword, errorOnPasswordSet] = useState(false)
  const [email, emailSet] = useState(p.connectEmail ?? "")
  const [token, tokenSet] = useState("")
  const [password, passwordSet] = useState("")

  async function recover(): Promise<void> {
    if (connecting) return

    errorOnEmailSet(false)
    errorOnTokenSet(false)
    errorOnPasswordSet(false)

    if ((email ?? '') == '') {
      errorOnEmailSet(true)
      toast({ title: 'Please type your email in the field!' })
      return
    }

    connectingSet(true)
    let response: ApiJsonResponse

    if (!tokenGenerated) {

      connectingSet(true)
      response = await userRecoverGenerateToken(email)
      console.log(response)

      if (response?.success ?? false) {
        tokenGeneratedSet(true)
        toast({
          title: 'Check your email',
          description: 'A verification code was sent to your email'
        })
      } else {
        toast({ title: 'Code delivery failed', description: response.error })
      }

    } else {

      if ((token ?? '') == '' || (password ?? '') == '') {

        connectingSet(false)
        errorOnTokenSet((token ?? '') == '')
        errorOnPasswordSet((password ?? '') == '')
        toast({
          title: errorOnToken
            ? 'Please specify the verification code from your email!'
            : 'Please enter a new password!'
        })
        return

      }

      connectingSet(true)
      response = await userRecover(email, token, password)
      console.log(response)

      if (response?.success) {

        toast({
          title: 'Account recovered',
          description: 'Your password was updated. Logging you in...'
        })

        const loginResponse = await userLogin(email, password)

        if (loginResponse.success) {
          toast({ title: 'Login successfully', description: 'You are logged in.' })
        } else {
          toast({
            title: 'Login failed',
            description: "Couldn't automatically login you in. Try to login manually."
          })
          p.login?.()
        }

      } else {
        toast({ title: 'Recover failed', description: response.error })
      }

    }
    connectingSet(false)
  }

  function onLoginLink() {
    p?.login()
  }

  return (
    <>

      <div className="flex flex-col w-full">
        <h1 className="flex mb-12 text-center text-lg font-bold">Recover account</h1>
        <form>
          <input
            value={email}
            onChange={(e) => {
              emailSet(e.target.value)
              p.onConnectEmailChange(e.target.value)
            }}
            disabled={tokenGenerated}
            type="email"
            name="email"
            autoComplete="email"
            title="Email"
            className="no-input-appearance flex w-full py-2 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none
					{errorOnEmail ? 'border-primary dark:border-primary-dark' : ''}"
            placeholder="Email"
          />
          {tokenGenerated &&
            <>
              <input
                value={token}
                onChange={(e) => { tokenSet(e.target.value) }}
                type="text"
                className="no-input-appearance flex w-full py-2 mt-4 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none
						{errorOnToken ? 'border-primary dark:border-primary-dark' : ''}"
                placeholder="Verification Code"
              />
              <input
                value={password}
                onChange={(e) => { passwordSet(e.target.value) }}
                type="password"
                className="no-input-appearance flex w-full py-2 mt-4 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none
						{errorOnPassword ? 'border-primary dark:border-primary-dark' : ''}"
                placeholder="New Password"
              />
            </>
          }
          <Spacing notLeft notRight autoScale="xl">
            <Button
              label={!tokenGenerated ? 'Send code' : 'Reset password'}
              onClick={recover}
              loading={connecting}
            />
          </Spacing>
        </form>
        <Spacing notLeft notRight autoScale="base">
          <Button
            label={p.fromLogin
              ? 'Back to Login'
              : 'Login page'}
            onClick={onLoginLink}
            type="ghost"
            small
          />
        </Spacing>
      </div>

    </>
  )
}