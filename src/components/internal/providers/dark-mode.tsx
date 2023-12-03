"use client"

import { useEffect, useState, ReactNode, createContext } from "react"

export const DarkModeContext = createContext<boolean>(false)

const getDarkMode = (): boolean => {
    try {
        return (window?.matchMedia('(prefers-color-scheme: dark)')?.matches) ?? false
    } catch (error) {
        return false
    }
}

export default function DarkModeProvider(p: { children: ReactNode }) {
    const [darkMode, darkModeSet] = useState<boolean>(getDarkMode())

    useEffect(() => {
        if (!window?.matchMedia) return
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const setTheme = () => {
            darkModeSet(getDarkMode())
        }

        mediaQuery.addEventListener('change', setTheme)

        return () => {
            mediaQuery.removeEventListener('change', setTheme)
        }
    }, [])

    return <DarkModeContext.Provider value={darkMode}>
        {p.children}
    </DarkModeContext.Provider>
}