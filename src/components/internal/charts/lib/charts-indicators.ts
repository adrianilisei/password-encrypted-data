import { SingleValueData, UTCTimestamp, WhitespaceData } from "lightweight-charts"
import { CandlestickModelIWithIndicators, StrategyParams, StrategyParamsForCandlesOnly, StrategyParamsI } from "types"

export type ChartIndicatorPreference = {
    useSamePriceChart: boolean
}

export type IndicatorChartType = {
    strategyParam: StrategyParams,
    indicatorPreference: ChartIndicatorPreference,
    valueData: (SingleValueData | WhitespaceData)[]
}

export const ChartIndicatorsPreferences: Partial<Record<StrategyParams, ChartIndicatorPreference>> = {
    rsiLength: { useSamePriceChart: false },
    bbPeriod: { useSamePriceChart: true }
}

export function getChartsWithIndicatorsFromCandles(candles: CandlestickModelIWithIndicators[], strategyParams: StrategyParams[] | StrategyParamsForCandlesOnly[], params: Partial<StrategyParamsI>): IndicatorChartType[] {

    const charts: IndicatorChartType[] = []
    const candlesOnlyParamsKeys = Object.keys(StrategyParamsForCandlesOnly)
    strategyParams = [...strategyParams.filter(p => candlesOnlyParamsKeys.includes(p))] as StrategyParamsForCandlesOnly[]

    for (const strategyParam of strategyParams) {

        const addIndicator = () => {

            const indicatorCharts: IndicatorChartType[] = []

            const prepareEmptyChartsSet = (chartsCount: number, preferences: ChartIndicatorPreference[]) => {
                while (indicatorCharts.length < chartsCount) indicatorCharts.push({
                    strategyParam: strategyParam as unknown as StrategyParams,
                    indicatorPreference: (preferences?.[indicatorCharts.length] ?? preferences?.[0]) ?? { useSamePriceChart: false },
                    valueData: []
                })
            }

            const addSetToCharts = (candle: CandlestickModelIWithIndicators, chartsCount: number, values: (number | undefined)[], preferences: ChartIndicatorPreference[]) => {
                prepareEmptyChartsSet(chartsCount, preferences)
                for (let i = 0; i < chartsCount; i++) {
                    indicatorCharts[i].valueData.push({
                        time: Math.floor(new Date(candle.openTime).getTime() / 1000) as UTCTimestamp,
                        value: values[i]
                    })
                }
            }

            for (const candle of candles) {
                switch (strategyParam) {
                    case StrategyParamsForCandlesOnly.maLength:
                        addSetToCharts(candle, 1, [candle.ma], [{ useSamePriceChart: true }])
                        break
                    case StrategyParamsForCandlesOnly.emaLength:
                        addSetToCharts(candle, 1, [candle.ema], [{ useSamePriceChart: true }])
                        break
                    case StrategyParamsForCandlesOnly.adxLength:
                        addSetToCharts(candle, 3, [candle.adx, candle.pdi, candle.mdi], [{ useSamePriceChart: false }])
                        break
                    case StrategyParamsForCandlesOnly.rsiLength:
                        addSetToCharts(candle, 1, [candle.rsi], [{ useSamePriceChart: false }])
                        break
                    case StrategyParamsForCandlesOnly.atrLength:
                        addSetToCharts(candle, 1, [candle.atr], [{ useSamePriceChart: false }])
                        break
                    case StrategyParamsForCandlesOnly.bbPeriod:
                        addSetToCharts(candle, 3, [candle.bbUpper, candle.bbMiddle, candle.bbLower], [{ useSamePriceChart: true }])
                        break
                }
            }
            charts.push(...indicatorCharts)

        }

        switch (strategyParam) {
            case StrategyParamsForCandlesOnly.maLength:
                addIndicator()
                break
            case StrategyParamsForCandlesOnly.emaLength:
                addIndicator()
                break
            case StrategyParamsForCandlesOnly.adxLength:
                addIndicator()
                break
            case StrategyParamsForCandlesOnly.rsiLength:
                addIndicator()
                break
            case StrategyParamsForCandlesOnly.atrLength:
                addIndicator()
                break
            case StrategyParamsForCandlesOnly.bbPeriod:
                addIndicator()
                break
        }
    }

    return charts
}