"use client"

import { useState } from "react"

export default function HomePageClient() {

  const [encrypted, encryptedSet] = useState(false)
  const [decrypted, decryptedSet] = useState(false)
  const [data, dataSet] = useState("")

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
          <textarea className="flex w-full h-16 bg-border dark:bg-border-dark rounded p-2 text-sm" placeholder="Sensitive data..." />
          <div className="flex flex-col w-full opacity-50 text-xs font-semibold leading-none pt-2">
            Add a password to securely encrypt or to decrypt your data
          </div>
          <input className="flex w-full bg-border dark:bg-border-dark rounded p-2 text-sm" placeholder="Password" />
          <div className="flex w-full space-x-2 text-xs font-semibold leading-none pt-4">
            <div className="flex p-2 rounded bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark cursor-default hover:opacity-75 transition-all active:scale-90">Encrypt</div>
            <div className="flex p-2 rounded bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark cursor-default hover:opacity-75 transition-all active:scale-90">Decrypt</div>
          </div>
          <div className="flex flex-col w-full opacity-50 text-xs font-semibold leading-none pt-4">
            {encrypted ? "Encrypted data" : decrypted ? "Decrypted data" : "The result will appear below"}
          </div>
          <textarea className="flex w-full h-16 bg-border dark:bg-border-dark rounded p-2 text-sm" placeholder="No data" value={data} />
        </div>
      }
    </>
  )
}