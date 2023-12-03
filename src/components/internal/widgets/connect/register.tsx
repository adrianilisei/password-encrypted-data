"use client"

import Spacing from "@/components/internal/spacing/spacing"
import { apiCheckReferralCode, saveUserLoginSessionOnClient, setLocalData, setSessionToken, userRegister } from "@/state/actions"
import { useEffect, useId, useRef, useState } from "react"
import { ApiJsonResponse, CurrentUser, CurrentUserI } from "types"
import Button from "../../buttons/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid"

export default function ConnectRegisterWidget(p: { onConnectEmailChange: (email: string) => void, login: () => void, connectEmail?: string, fromLogin?: boolean, referral?: string }) {

  const id = useId()
  const { toast } = useToast()
  const checboxId = useId()
  const [termsAccepted, termsAcceptedSet] = useState(false)
  const [connecting, connectingSet] = useState(false)
  const [logging, loggingSet] = useState(false)
  const [errorOnName, errorOnNameSet] = useState(false)
  const [errorOnEmail, errorOnEmailSet] = useState(false)
  const [errorOnPassword, errorOnPasswordSet] = useState(false)
  const [name, nameSet] = useState("")
  const [email, emailSet] = useState(p.connectEmail ?? "")
  const [password, passwordSet] = useState("")
  const [tokenCode, tokenCodeSet] = useState("")
  const [referral, referralSet] = useState(p.referral ?? "")
  const [isReferralValid, isReferralValidSet] = useState(false)
  const [checkingReferral, checkingReferralSet] = useState(false)
  const [referralChecked, referralCheckedSet] = useState("")
  const checkingReferralRef = useRef(false)
  const isTokenGenerated = useRef(false)
  const [tokenGenerated, tokenGeneratedSet] = useState(false)

  async function register(): Promise<void> {
    if (connecting) return

    if (!termsAccepted) {
      toast({ title: 'Please read & agree with Privacy Policy' })
      return
    }

    errorOnNameSet(false)
    errorOnEmailSet(false)
    errorOnPasswordSet(false)

    if (isTokenGenerated.current) {
      if ((tokenCode ?? '') == '' || (name ?? '') == '' || (email ?? '') == '' || (password ?? '') == '') {
        errorOnNameSet((name ?? '') == '')
        errorOnEmailSet((email ?? '') == '')
        errorOnPasswordSet((password ?? '') == '')
        toast({ title: 'Please fill all the fields!' })
        return
      }
    }

    connectingSet(true)
    const registerResponse: ApiJsonResponse = await userRegister(name, email, password, tokenCode, !isTokenGenerated.current, (p.referral ?? referral))

    if (registerResponse.success) {
      if (!isTokenGenerated.current) {
        isTokenGenerated.current = true
        tokenGeneratedSet(isTokenGenerated.current)
      } else {
        loggingSet(true)
        const token = ((registerResponse?.data as Record<string, unknown>)?.['session'] as Record<string, unknown>)?.['token'] as string ?? ''
        const user: CurrentUserI = {
          session_token: token,
          is_connected: true,
          ...(registerResponse?.data as Record<string, unknown>)?.["user"] as Record<string, unknown>
        } as CurrentUserI
        await saveUserLoginSessionOnClient(user, token)
        toast({ title: 'Connected', description: "You will be redirected in a moment..." })
        window.location.href = "/dashboard"
        return
      }
    } else {
      if (registerResponse.code == "6f13c71f-9cac-444d-ae57-7770bf505be3") {
        p?.login()
        toast({ title: 'Account detected', description: "This email is already linked to an account. You can login now." })
      } else {
        toast({ title: 'Registration failed', description: registerResponse.error })
      }
    }
    connectingSet(false)
  }

  function onLoginLink(e?: any) {
    p?.login()
    e?.preventDefault?.()
  }

  async function checkReferral(): Promise<void> {
    if ((p?.referral ?? "") != '') return
    if (referralChecked == referral) return
    checkingReferralRef.current = true
    checkingReferralSet(true)
    isReferralValidSet(true)
    referralCheckedSet(referral)
    const referralInChecking = referral

    const checkResult: ApiJsonResponse = await apiCheckReferralCode(referral)
    if (referralInChecking == referral) {
      isReferralValidSet(checkResult.success)
      checkingReferralRef.current = false
      checkingReferralSet(false)
    }

  }

  useEffect(() => {
    const checkReferralTimeout = setTimeout(() => {
      checkReferral()
    }, 2500)

    return () => clearTimeout(checkReferralTimeout)
  }, [referral])

  return (
    <>
      <div className="flex flex-col w-full">
        <h1 className="flex mb-12 text-center text-lg font-bold">Create an account</h1>
        <form>
          <input
            value={email}
            disabled={connecting || tokenGenerated}
            onChange={(e) => {
              emailSet(e.target.value)
              p.onConnectEmailChange(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") register()
            }}
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            title="Email"
            className="no-input-appearance flex w-full py-2 mt-4 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none disabled:opacity-50
					{errorOnEmail ? 'border-primary dark:border-primary-dark' : ''}
					"
            placeholder="Email"
          />
          {tokenGenerated && <>
            <div className="flex mt-4 text-xs font-semibold opacity-50">A verification code was sent to your email. Please write the code below.</div>
            <input
              value={tokenCode}
              disabled={connecting}
              onChange={(e) => {
                tokenCodeSet(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") document.getElementById(`${id}-password`)?.focus?.()
              }}
              id={`${id}-token-code`}
              type="text"
              className="no-input-appearance flex w-full py-2 mb-4 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none disabled:opacity-50"
              placeholder="Verification code"
            />
            <input
              value={password}
              disabled={connecting}
              onChange={(e) => {
                passwordSet(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") document.getElementById(`${id}-name`)?.focus?.()
              }}
              id={`${id}-password`}
              type="password"
              className="no-input-appearance flex w-full py-2 my-4 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none disabled:opacity-50
					{errorOnPassword ? 'border-primary dark:border-primary-dark' : ''}
					"
              placeholder="Password"
            />
            <input
              value={name}
              disabled={connecting}
              onChange={(e) => {
                nameSet(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  if ((p?.referral ?? "") == "") document.getElementById(`${id}-referral`)?.focus?.()
                  else register()
                }
              }}
              id={`${id}-name`}
              type="name"
              name="name"
              autoComplete="name"
              title="Name"
              className="no-input-appearance flex w-full py-2 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none disabled:opacity-50
					{errorOnName ? 'border-primary dark:border-primary-dark' : ''}
					"
              placeholder="Name"
            />
            <input
              value={referral}
              disabled={connecting || (p?.referral ?? "") != ''}
              onChange={(e) => {
                if ((p?.referral ?? "") != '') return
                referralSet(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  if (isReferralValid) register()
                  else checkReferral()
                }
              }}
              id={`${id}-referral`}
              type="text"
              className="no-input-appearance flex w-full py-2 mt-4 bg-transparent text-base leading-none font-normal text-text dark:text-text-dark border-b border-on_background dark:border-on_background-dark outline-none rounded-none disabled:opacity-50"
              placeholder="Referral code"
            />
          </>
          }
          {(p?.referral ?? "") == '' && referral != "" &&
            <div className="flex w-full justify-start items-center mt-1 text-xs font-semibold opacity-50">
              {checkingReferral || referralChecked != referral ?
                <div className="animate-pulse">Checking referral code...</div>
                :
                (referralChecked == referral &&
                  <>
                    {isReferralValid ?
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Referral code is valid
                      </>
                      :
                      <>
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        Referral code is not valid
                      </>
                    }
                  </>
                )
              }
            </div>
          }
          <div className="flex w-full justify-start items-center mt-4">
            <Checkbox disabled={connecting} id={checboxId} checked={termsAccepted} onCheckedChange={(c) => termsAcceptedSet(c == "indeterminate" ? false : c)} />
            <label htmlFor={checboxId} className="text-text/50 dark:text-text-dark/50 ml-1">
              I agree with the&nbsp;<a
                href="/#"
                onClick={(e) => e.preventDefault()}
                className="text-primary/75 dark:text-primary-dark/75">Privacy Policy</a
              >
            </label>
          </div>
          <Spacing notLeft notRight autoScale="xl">
            <Button label={logging ? "Setting your account up..." : (tokenGenerated ? "Create account" : "Continue registration")} onClick={register} loading={connecting || logging} />
          </Spacing>
          <Spacing notLeft notRight autoScale="base">
            <Button
              label={p.fromLogin ?? false
                ? 'Back to Login'
                : 'I have an account'}
              onClick={() => {
                onLoginLink()
              }}
              type="ghost"
              small
            />
          </Spacing>
        </form>
      </div>

    </>
  )
}