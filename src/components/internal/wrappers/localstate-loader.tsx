"use client"

import { loadSessionAndLocalData } from "@/state/actions"
import appStore from "@/stores/app"
import { useEffect, useState, ReactNode, createContext } from "react"
import { get } from "svelte/store"

export const LocalstateLoaderContext = createContext<boolean>(true)

export default function LocalstateLoaderWrapper(p: { children: ReactNode }) {
    const [loadedLocalState, loadedLocalStateSet] = useState<boolean>(get(appStore)?.is_loaded_local_data ?? false)

    useEffect(() => {
        loadSessionAndLocalData()
    }, [])

    useEffect(() => {
        const h = () => {
            loadedLocalStateSet(get(appStore)?.is_loaded_local_data ?? false)
        }
        h()
        return appStore.subscribe(h)
    }, [])

    return <LocalstateLoaderContext.Provider value={!loadedLocalState}>
        {p.children}
    </LocalstateLoaderContext.Provider>
}