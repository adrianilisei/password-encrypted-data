"use client"

import { AES, SHA256, enc, format } from "crypto-js"
import { useEffect, useState } from "react"

type PasswordPower = {
  lowercase: boolean,
  uppercase: boolean,
  numbers: boolean,
  special: boolean,
  twenty: boolean
}

export default function HomePageClient() {

  const [encrypted, encryptedSet] = useState(false)
  const [decrypted, decryptedSet] = useState(false)
  const [sensitiveData, sensitiveDataSet] = useState("")
  const [password, passwordSet] = useState("")
  const [result, resultSet] = useState("")
  const [passwordPower, passwordPowerSet] = useState<PasswordPower>({ lowercase: false, uppercase: false, numbers: false, special: false, twenty: false })

  useEffect(() => {
    passwordPowerSet({
      lowercase: password.search(/[a-z]/gm) != -1,
      uppercase: password.search(/[A-Z]/gm) != -1,
      numbers: password.search(/\d/gm) != -1,
      special: password.search(/[^A-Za-z0-9]/gm) != -1,
      twenty: password.length >= 20
    })
  }, [password])

  function encryptData() {
    encryptedSet(true)
    decryptedSet(false)
    resultSet("")

    const passwordHash = SHA256(password).toString()
    resultSet(AES.encrypt(sensitiveData + passwordHash, passwordHash).toString(format.OpenSSL))
  }

  function decryptData() {
    encryptedSet(false)
    decryptedSet(true)
    resultSet("")

    const passwordHash = SHA256(password).toString()
    resultSet(AES.decrypt(sensitiveData, passwordHash, { format: format.OpenSSL }).toString(enc.Utf8).replace(passwordHash, ""))
  }

  return (
    <>
      {
        <div className="flex flex-col w-full space-y-2">
          <div className="flex flex-col w-full opacity-90 text-xl font-semibold leading-none">
            Password encrypted data
          </div>
          <div className="flex flex-col w-full opacity-75 text-sm leading-none">
            Securely encrypt data with a password
          </div>
          <div className="flex flex-col w-full opacity-50 text-xs font-semibold leading-none pt-8">
            Add data to be encrypted or decrypted
          </div>
          <textarea onChange={(e) => {
            sensitiveDataSet(e.target.value)
          }} className="flex w-full h-16 bg-border dark:bg-border-dark rounded p-2 text-sm" placeholder="Sensitive data..." />
          <div className="flex flex-col w-full opacity-50 text-xs font-semibold leading-none pt-2">
            Add a password to securely encrypt or to decrypt your data
            <div className="flex flex-col w-full text-xs font-medium leading-none pt-4">
              Make sure you set a strong password that is impossible to be cracked, using the requirements below.
            </div>
          </div>
          <input onChange={(e) => {
            passwordSet(e.target.value)
          }} className="flex w-full bg-border dark:bg-border-dark rounded p-2 text-sm" placeholder="Password" />
          <div className="flex flex-col space-y-2 text-xs font-semibold leading-none pt-2">
            <div className={`flex w-full ${passwordPower.uppercase ? "" : "opacity-50"}`}>{passwordPower.uppercase ? "✅" : "❌"} Uppercase</div>
            <div className={`flex w-full ${passwordPower.lowercase ? "" : "opacity-50"}`}>{passwordPower.lowercase ? "✅" : "❌"} Lowercase</div>
            <div className={`flex w-full ${passwordPower.numbers ? "" : "opacity-50"}`}>{passwordPower.numbers ? "✅" : "❌"} Numbers</div>
            <div className={`flex w-full ${passwordPower.special ? "" : "opacity-50"}`}>{passwordPower.special ? "✅" : "❌"} Special characters</div>
            <div className={`flex w-full ${passwordPower.twenty ? "" : "opacity-50"}`}>{passwordPower.twenty ? "✅" : "❌"} Min 20 characters</div>
          </div>
          <div className="flex w-full space-x-2 text-xs font-semibold leading-none pt-4">
            <div onClick={encryptData} className="flex p-2 rounded bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark cursor-default hover:opacity-75 transition-all active:scale-90">Encrypt</div>
            <div onClick={decryptData} className="flex p-2 rounded bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark cursor-default hover:opacity-75 transition-all active:scale-90">Decrypt</div>
          </div>
          <div className="flex flex-col w-full opacity-50 text-xs font-semibold leading-none pt-4">
            {encrypted ? "Encrypted data" : decrypted ? "Decrypted data" : "The result will appear below"}
            <div className="flex flex-col w-full text-xs font-medium leading-none pt-4">
              Your encrypted data is safe to store anywhere as long as you use a strong password that cannot be brute forced.
            </div>
          </div>
          <textarea onChange={() => null} className="flex w-full h-16 bg-border dark:bg-border-dark rounded p-2 text-sm" placeholder="No data" value={result} />
        </div>
      }
    </>
  )
}