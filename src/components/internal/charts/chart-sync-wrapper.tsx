'use client'

import React, { ReactElement, cloneElement, useId } from 'react'
import { GLOBAL_STORE_COLLECTIONS } from '@/stores/global'
import { ChartParams } from './chart'

export interface ChartSyncWrapperParams {
    children: ReactElement<ChartParams>[] | ReactElement<ChartParams>,
    groupingId?: string,
    fullHeight?: boolean
}

const ChartSyncWrapper: React.FunctionComponent<ChartSyncWrapperParams> = ({ groupingId, children, fullHeight }) => {
    const id = useId()

    if (!Array.isArray(children)) children = [children]

    return <div className="flex flex-col w-full h-full">
        {children.map((child) => {
            const paneSize = child?.props?.paneSize ?? "NA"
            return <div className={`flex w-full flex-auto border-b last:border-b-0 border-border dark:border-border-dark ${{
                "xs": (fullHeight ? "h-1/4" : "h-32"),
                "sm": (fullHeight ? "h-1/3" : "h-48"),
                "md": (fullHeight ? "h-1/2" : "h-64"),
                "lg": (fullHeight ? "h-2/3" : "h-80"),
                "xl": (fullHeight ? "h-3/4" : "h-96"),
                "NA": (fullHeight ? "h-full" : "h-64")
            }[paneSize]}`}>
                {cloneElement(child, {
                    groupingId: groupingId ?? (GLOBAL_STORE_COLLECTIONS.CHART_RANGE_SYNC + `_${id}`),
                })}
            </div>
        })}
    </div >
}

export default ChartSyncWrapper