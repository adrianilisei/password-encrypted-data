'use client'

import '../static/css/globals.css'
import Spacing from '@/components/internal/spacing/spacing'
import MaxWidth from '@/components/internal/spacing/max-width'
import { useEffect } from 'react'

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode
}) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => null)
    }
  }, [])

  return (
    <html lang="en">
      <body className={`font-mono bg-surface text-surface-foreground dark:bg-surface-dark dark:text-surface-foreground-dark`}>
        <div className={`flex flex-col w-full font-[monospace] ${false ? 'bg-gradient-to-r from-surface to-orange-100 dark:from-surface-dark dark:to-orange-950' : 'bg-surface dark:bg-surface-dark'} text-surface-foreground dark:text-surface-foreground-dark`}>
          <div className='flex w-full'>
            <div className='flex z-10'>
            </div>
            <div className='flex flex-col w-full z-0'>
              <div className='flex w-full z-10'>
              </div>
              <div className='relative z-0'>
                <Spacing autoScale="xl">
                  <div className="flex justify-center w-full">
                    <MaxWidth>
                      {children}
                    </MaxWidth>
                  </div>
                </Spacing>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
