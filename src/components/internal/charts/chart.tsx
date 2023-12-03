/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createChart, ColorType, CrosshairMode, PriceLineSource, LineType } from 'lightweight-charts'
import type {
    ChartOptions,
    DeepPartial,
    AreaData,
    WhitespaceData,
    CandlestickData,
    BaselineData,
    HistogramData,
    IChartApi,
    AreaSeriesOptions,
    CandlestickSeriesOptions,
    HistogramSeriesOptions,
    BaselineSeriesOptions,
    LogicalRangeChangeEventHandler,
    LogicalRange,
    LineSeriesOptions
} from 'lightweight-charts'
import { debounce, isEqual, merge, throttle } from 'lodash'
import { THEME_COLORS, rgbWithOpacity } from '@/const/theme'
import { LegacyRef, useContext, useEffect, useId, useRef, useState } from 'react'
import { formatAmount } from 'utilities'
import { GLOBAL_STORE_COLLECTIONS_GROUPED, globalStoreGet, globalStoreSet } from '@/stores/global'
import { Writable } from 'svelte/store'
import { get } from 'svelte/store'
import { useThrottle } from '@/hooks/throttle'
import { DarkModeContext } from '../providers/dark-mode'

export interface ChartSeriesI {
    type: 'area' | 'candlesticks' | 'histogram' | 'baseline' | "line",
    values: (WhitespaceData | AreaData | CandlestickData | HistogramData | BaselineData)[]
    options?: DeepPartial<
        AreaSeriesOptions | CandlestickSeriesOptions | HistogramSeriesOptions | BaselineSeriesOptions
    >
}

export interface ChartSettings {
    fitContent?: boolean,
    autoSize?: boolean,
    width?: number,
    height?: number,
    paneSize?: "xs" | "sm" | "md" | "lg" | "xl",
    series: ChartSeriesI[],
    chartOptions?: DeepPartial<ChartOptions>,
    dark?: boolean
}

const getDefaultChartOptions = (p: ChartSettings): DeepPartial<ChartOptions> => {
    return {
        layout: {
            textColor: p?.dark
                ? rgbWithOpacity(THEME_COLORS.on_surface_dark, 0.5)
                : rgbWithOpacity(THEME_COLORS.on_surface, 0.5),
            background: {
                type: ColorType.VerticalGradient,
                // color: p?.dark ? THEME_COLORS.surface_dark : THEME_COLORS.surface
                topColor: p?.dark ? rgbWithOpacity(THEME_COLORS.on_surface_dark, 0.1) : rgbWithOpacity(THEME_COLORS.surface, 0.05),
                bottomColor: p?.dark ? rgbWithOpacity(THEME_COLORS.surface_dark, 0.1) : rgbWithOpacity(THEME_COLORS.on_surface, 0.05)
            },
            fontFamily: "monospace, monospace"
        },
        crosshair: {
            mode: CrosshairMode.Magnet,
            horzLine: {
                color: p?.dark
                    ? rgbWithOpacity(THEME_COLORS.on_surface_dark, 0.75)
                    : rgbWithOpacity(THEME_COLORS.on_surface, 0.75),
                labelBackgroundColor: p?.dark ? THEME_COLORS.primary_dark : THEME_COLORS.primary
            },
            vertLine: {
                color: p?.dark
                    ? rgbWithOpacity(THEME_COLORS.on_surface_dark, 0.75)
                    : rgbWithOpacity(THEME_COLORS.on_surface, 0.75),
                labelBackgroundColor: p?.dark ? THEME_COLORS.primary_dark : THEME_COLORS.primary
            }
        },
        grid: {
            horzLines: {
                color: p?.dark
                    ? rgbWithOpacity(THEME_COLORS.border_dark, 0.5)
                    : rgbWithOpacity(THEME_COLORS.border, 0.5)
            },
            vertLines: {
                color: p?.dark
                    ? rgbWithOpacity(THEME_COLORS.border_dark, 0.5)
                    : rgbWithOpacity(THEME_COLORS.border, 0.5)
            }
        },
        autoSize: p?.autoSize ?? true,
        width: p?.width ?? 0,
        height: p?.height ?? 0,
        timeScale: {
            timeVisible: true,
            borderColor: p?.dark ? THEME_COLORS.border_dark : THEME_COLORS.border
        },
        overlayPriceScales: { scaleMargins: { bottom: 0 } },
        leftPriceScale: {
            textColor: p?.dark
                ? rgbWithOpacity(THEME_COLORS.on_surface_dark, 0.5)
                : rgbWithOpacity(THEME_COLORS.on_surface, 0.5),
            borderColor: p?.dark ? THEME_COLORS.border_dark : THEME_COLORS.border,
            visible: false
        },
        rightPriceScale: {
            textColor: p?.dark
                ? rgbWithOpacity(THEME_COLORS.on_surface_dark, 0.5)
                : rgbWithOpacity(THEME_COLORS.on_surface, 0.5),
            borderColor: p?.dark ? THEME_COLORS.border_dark : THEME_COLORS.border,
            visible: true
        }
    }
}

const getDefaultAreaSeriesOptions = (p: ChartSettings): DeepPartial<AreaSeriesOptions> => {
    return {}
}

const getDefaultCandlesticksOptions = (p: ChartSettings): DeepPartial<CandlestickSeriesOptions> => {
    return {
        upColor: p?.dark
            ? rgbWithOpacity(THEME_COLORS.profits_dark, 0.9)
            : rgbWithOpacity(THEME_COLORS.profits, 0.9),
        downColor: p?.dark
            ? rgbWithOpacity(THEME_COLORS.losses_dark, 0.9)
            : rgbWithOpacity(THEME_COLORS.losses, 0.9),
        borderVisible: false,
        wickUpColor: p?.dark
            ? rgbWithOpacity(THEME_COLORS.profits_dark, 0.9)
            : rgbWithOpacity(THEME_COLORS.profits, 0.9),
        wickDownColor: p?.dark
            ? rgbWithOpacity(THEME_COLORS.losses_dark, 0.9)
            : rgbWithOpacity(THEME_COLORS.losses, 0.9),
        priceFormat: {
            type: "custom",
            formatter: (price: number) => {
                return formatAmount(price)
            }
        }
    }
}

const getDefaultHistogramSeriesOptions = (p: ChartSettings): DeepPartial<HistogramSeriesOptions> => {
    return {
        priceScaleId: '',
        priceFormat: { type: 'price' },
        priceLineVisible: false,
        priceLineSource: PriceLineSource.LastVisible,

        color: p?.dark
            ? rgbWithOpacity(THEME_COLORS.border_dark, 0.75)
            : rgbWithOpacity(THEME_COLORS.border, 0.75)
    }
}

const getDefaultBaselineOptions = (p: ChartSettings): DeepPartial<BaselineSeriesOptions> => {
    const darkMode = p?.dark ?? false
    return {
        topFillColor1: darkMode
            ? rgbWithOpacity(THEME_COLORS.profits_dark, 0.75)
            : rgbWithOpacity(THEME_COLORS.profits, 0.75),
        topFillColor2: darkMode
            ? rgbWithOpacity(THEME_COLORS.profits_dark, 0.05)
            : rgbWithOpacity(THEME_COLORS.profits, 0.05),
        topLineColor: darkMode
            ? rgbWithOpacity(THEME_COLORS.profits_dark, 0.9)
            : rgbWithOpacity(THEME_COLORS.profits, 0.9),
        bottomFillColor1: darkMode
            ? rgbWithOpacity(THEME_COLORS.losses_dark, 0.05)
            : rgbWithOpacity(THEME_COLORS.losses, 0.05),
        bottomFillColor2: darkMode
            ? rgbWithOpacity(THEME_COLORS.losses_dark, 0.75)
            : rgbWithOpacity(THEME_COLORS.losses, 0.75),
        bottomLineColor: darkMode
            ? rgbWithOpacity(THEME_COLORS.losses_dark, 0.9)
            : rgbWithOpacity(THEME_COLORS.losses, 0.9),
        lineWidth: 2,
        lineType: LineType.Curved,
        baseValue: { type: 'price', price: 0 }
    }
}

const getDefaultLineOptions = (p: ChartSettings): DeepPartial<LineSeriesOptions> => {
    const darkMode = p?.dark ?? false
    return {
        baseLineColor: darkMode
            ? rgbWithOpacity(THEME_COLORS.on_surface_dark, 0.9)
            : rgbWithOpacity(THEME_COLORS.on_surface, 0.9),
        lineWidth: 2,
        lineType: LineType.Curved,
    }
}

interface ChartRangeSync {
    scrollPosition: number | undefined,
    logicalRange: LogicalRange | null
}

export type ChartParams = ChartSettings & { groupingId?: string, label?: string }

export default function Chart(p: ChartParams) {
    const id = useId()
    const darkMode = useContext(DarkModeContext)
    const chartRangeRef = useRef<ChartRangeSync | null>(null)
    const wrapperRef = useRef<HTMLElement>()
    const chartApi = useRef<IChartApi>()
    const [groupState] = useState<Writable<ChartRangeSync | null>>(globalStoreGet(GLOBAL_STORE_COLLECTIONS_GROUPED.CHART_RANGE_SYNC(p?.groupingId ?? id), null))

    const [chartRange, chartRangeSet] = useState<ChartRangeSync | null>(null)

    const setSyncPosition = useRef(() => {
        if (p?.groupingId && chartRangeRef.current?.logicalRange != null) {
            globalStoreSet(GLOBAL_STORE_COLLECTIONS_GROUPED.CHART_RANGE_SYNC(p.groupingId), chartRangeRef.current)
        }
    })

    const setSyncPositionThrottled = useThrottle(() => {
        setSyncPosition.current()
    }, 0)

    const setSyncPositionDebouncedTimeout = useRef<NodeJS.Timeout>()
    const setSyncPositionDebounced = useRef(() => {
        clearTimeout(setSyncPositionDebouncedTimeout.current)
        setSyncPositionDebouncedTimeout.current = setTimeout(() => {
            setSyncPosition.current()
        }, 0)
    })

    const logicalRangeSubscription = useRef<LogicalRangeChangeEventHandler>((handler: LogicalRange | null) => {
        if (p?.groupingId) {
            const timescale = chartApi.current?.timeScale()
            const scrollPosition = timescale?.scrollPosition()
            chartRangeRef.current = {
                scrollPosition,
                logicalRange: handler
            }
            // setSyncPositionThrottled()
            // setSyncPositionDebounced.current()
            setSyncPosition.current()
        }
    })

    function render() {
        try {
            if (!wrapperRef.current) return
            const element = wrapperRef.current
            if (!element) return
            element?.replaceChildren()
            const chart: IChartApi = createChart(element, merge(getDefaultChartOptions({ ...p, dark: darkMode }), p?.chartOptions))
            chartApi.current = chart

            const timescale = chart.timeScale()

            timescale.unsubscribeVisibleLogicalRangeChange(logicalRangeSubscription.current)
            chart.timeScale().subscribeVisibleLogicalRangeChange(logicalRangeSubscription.current)


            for (let i = 0; i < p.series.length; i++) {
                const cSeries = p.series[i]

                switch (cSeries.type) {
                    case 'area':
                        chart
                            .addAreaSeries(merge(getDefaultAreaSeriesOptions({ ...p, dark: darkMode }), cSeries.options))
                            .setData(cSeries.values)
                        break
                    case 'candlesticks':
                        const m = merge(getDefaultCandlesticksOptions({ ...p, dark: darkMode }), cSeries.options)
                        chart
                            .addCandlestickSeries(m)
                            .setData(cSeries.values)
                        break
                    case 'histogram':
                        chart
                            .addHistogramSeries(merge(getDefaultHistogramSeriesOptions({ ...p, dark: darkMode }), cSeries.options))
                            .setData(cSeries.values)
                        break
                    case 'baseline':
                        chart
                            .addBaselineSeries(merge(getDefaultBaselineOptions({ ...p, dark: darkMode }), cSeries.options))
                            .setData(cSeries.values)
                        break
                    case 'line':
                        chart
                            .addBaselineSeries(merge(getDefaultLineOptions({ ...p, dark: darkMode }), cSeries.options))
                            .setData(cSeries.values)
                        break
                    default:
                        break
                }
            }

            if (p?.fitContent) fitContent()
            else setLogicalRange()
        } catch (error) { }
    }

    function fitContent() {
        const chart = chartApi.current
        try {
            chart?.timeScale()?.fitContent()
        } catch (error) {
            console.error(error)
        }
    }

    function setLogicalRange() {
        if (chartApi.current === undefined) return
        const timescale = chartApi.current?.timeScale()
        if (chartRangeRef.current) {
            if (!chartRangeRef.current.logicalRange) return
            if (isEqual(timescale.getVisibleLogicalRange(), chartRangeRef.current.logicalRange)) return
            timescale.setVisibleLogicalRange(chartRangeRef.current.logicalRange)
        }
    }

    useEffect(() => {
        render()
    }, [wrapperRef])

    useEffect(() => {
        const resizeThrottled = throttle(() => {
            render()
        }, 100)

        const resizeDebounced = debounce(() => {
            render()
        }, 100)

        const h = () => {
            resizeThrottled()
            resizeDebounced()
        }
        const u = window.addEventListener("resize", h, { passive: true })
        return u
    }, [p])

    useEffect(() => {
        render()
    }, [darkMode])

    useEffect(() => {
        setLogicalRange()
    }, [chartRange])

    useEffect(() => {
        render()
    }, [p.series])

    useEffect(() => {
        const s = groupState.subscribe(() => {
            const newChartRange = get(groupState)
            if (!isEqual(chartRangeRef.current, newChartRange)) {
                chartRangeRef.current = newChartRange
                chartRangeSet(chartRangeRef.current)
            }
        })
        return () => { s() }
    }, [])

    return <div className='flex w-full h-full relative'>
        <div className='flex w-full h-full relative z-0'>
            <div ref={wrapperRef as LegacyRef<HTMLDivElement> | undefined} className='flex w-full h-full' />
        </div>
        {p?.label !== undefined &&
            <div className='flex absolute top-2 left-2 p-0.5 px-1 rounded bg-border/75 text-surface-foreground/50 dark:bg-border-dark/75 dark:text-surface-foreground-dark/50 text-xs font-medium z-10'>{p?.label}</div>
        }
    </div>
}