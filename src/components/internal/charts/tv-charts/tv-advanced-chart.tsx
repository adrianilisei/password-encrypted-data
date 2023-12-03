// "use client"

// import { useEffect, useRef } from 'react'
// import './index.css'
// import {
// 	widget,
// 	ChartingLibraryWidgetOptions,
// 	LanguageCode,
// 	ResolutionString,
// 	DatafeedConfiguration,
// 	LibrarySymbolInfo,
// } from 'tv-charting-library'
// import * as React from 'react'
// import { getAllSymbols, makeApiRequest, parseFullSymbol } from './helpers'

// export interface ChartContainerProps {
// 	symbol: ChartingLibraryWidgetOptions['symbol']
// 	interval: ChartingLibraryWidgetOptions['interval']

// 	// BEWARE: no trailing slash is expected in feed URL
// 	datafeedUrl: string
// 	libraryPath: ChartingLibraryWidgetOptions['library_path']
// 	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
// 	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
// 	clientId: ChartingLibraryWidgetOptions['client_id']
// 	userId: ChartingLibraryWidgetOptions['user_id']
// 	fullscreen: ChartingLibraryWidgetOptions['fullscreen']
// 	autosize: ChartingLibraryWidgetOptions['autosize']
// 	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
// 	container: ChartingLibraryWidgetOptions['container']
// }

// const getLanguageFromURL = (): LanguageCode | null => {
// 	const regex = new RegExp('[\\?&]lang=([^&#]*)')
// 	const results = regex.exec(location.search)
// 	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode
// }

// export const TVChart = () => {
// 	const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>

// 	const defaultProps: Omit<ChartContainerProps, 'container'> = {
// 		symbol: 'Binance:BTC/USDT',
// 		interval: '1D' as ResolutionString,
// 		datafeedUrl: 'https://demo_feed.tradingview.com',
// 		libraryPath: '/api/public/tv-charting-library/',
// 		chartsStorageUrl: 'https://saveload.tradingview.com',
// 		chartsStorageApiVersion: '1.1',
// 		clientId: 'tradingview.com',
// 		userId: 'public_user_id',
// 		fullscreen: false,
// 		autosize: true,
// 		studiesOverrides: {},
// 	}

// 	const configurationData: DatafeedConfiguration = {
// 		// Represents the resolutions for bars supported by your datafeed
// 		supported_resolutions: ['1D', '1W', '1M'] as ResolutionString[],
// 		// The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
// 		exchanges: [
// 			{ value: 'Binance', name: 'Binance', desc: 'Binance' }
// 		],
// 		// The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
// 		symbols_types: [
// 			{ name: 'Crypto', value: 'crypto' }
// 		]
// 	}

// 	useEffect(() => {
// 		const widgetOptions: ChartingLibraryWidgetOptions = {
// 			symbol: defaultProps.symbol as string,
// 			settings_adapter: {
// 				initialSettings: {},
// 				setValue: function (key, value) { },
// 				removeValue: function (key) { },
// 			},
// 			// BEWARE: no trailing slash is expected in feed URL
// 			// tslint:disable-next-line:no-any
// 			datafeed: {
// 				onReady: (callback) => {
// 					console.log('[onReady]: Method call')
// 					callback(configurationData)
// 				},
// 				searchSymbols: async (
// 					userInput,
// 					exchange,
// 					symbolType,
// 					onResultReadyCallback
// 				) => {
// 					console.log('[searchSymbols]: Method call')
// 					const symbols = await getAllSymbols()
// 					const newSymbols = symbols.filter(symbol => {
// 						const isExchangeValid = exchange === '' || symbol.exchange === exchange
// 						const isFullSymbolContainsInput = symbol.full_name
// 							.toLowerCase()
// 							.indexOf(userInput.toLowerCase()) !== -1
// 						return isExchangeValid && isFullSymbolContainsInput
// 					})
// 					onResultReadyCallback(newSymbols)
// 				},
// 				resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
// 					console.log('[resolveSymbol]: Method call', symbolName)
// 					const symbols = await getAllSymbols()
// 					const symbolItem = symbols.find(({ full_name }) => full_name === symbolName)
// 					if (!symbolItem) {
// 						console.log('[resolveSymbol]: Cannot resolve symbol', symbolName)
// 						onResolveErrorCallback('Cannot resolve symbol')
// 						return
// 					}
// 					// Symbol information object
// 					const symbolInfo: LibrarySymbolInfo = {
// 						ticker: symbolItem.full_name,
// 						name: symbolItem.symbol,
// 						description: symbolItem.description,
// 						type: symbolItem.type,
// 						session: '24x7',
// 						timezone: 'Etc/UTC',
// 						exchange: symbolItem.exchange,
// 						minmov: 1,
// 						pricescale: 100,
// 						has_intraday: false,
// 						visible_plots_set: 'ohlc',
// 						has_weekly_and_monthly: false,
// 						supported_resolutions: configurationData.supported_resolutions!,
// 						volume_precision: 2,
// 						data_status: 'streaming',
// 						full_name: '',
// 						listed_exchange: '',
// 						format: 'price'
// 					}
// 					console.log('[resolveSymbol]: Symbol resolved', symbolName)
// 					onSymbolResolvedCallback(symbolInfo)
// 				},
// 				getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
// 					const { from, to, firstDataRequest } = periodParams
// 					console.log(from, to, firstDataRequest)
// 					console.log('[getBars]: Method call', symbolInfo, resolution, from, to)
// 					const parsedSymbol = parseFullSymbol(symbolInfo.full_name)
// 					const urlParameters = {
// 						e: parsedSymbol.exchange,
// 						fsym: parsedSymbol.fromSymbol,
// 						tsym: parsedSymbol.toSymbol,
// 						toTs: to,
// 						limit: 2000,
// 					}
// 					const query = Object.keys(urlParameters)
// 						.map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
// 						.join('&')
// 					try {
// 						const data = await makeApiRequest(`data/histoday?${query}`)
// 						if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
// 							// "noData" should be set if there is no data in the requested period
// 							onHistoryCallback([], { noData: true })
// 							return
// 						}
// 						let bars = []
// 						data.Data.forEach(bar => {
// 							if (bar.time >= from && bar.time < to) {
// 								bars = [...bars, {
// 									time: bar.time * 1000,
// 									low: bar.low,
// 									high: bar.high,
// 									open: bar.open,
// 									close: bar.close,
// 								}]
// 							}
// 						})
// 						console.log(`[getBars]: returned ${bars.length} bar(s)`)
// 						onHistoryCallback(bars, { noData: false })
// 					} catch (error) {
// 						console.log('[getBars]: Get error', error)
// 						onErrorCallback(error)
// 					}
// 				},
// 				subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
// 					console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID)
// 				},
// 				unsubscribeBars: (subscriberUID) => {
// 					console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID)
// 				},
// 			},
// 			interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
// 			container: chartContainerRef.current,
// 			library_path: defaultProps.libraryPath as string,
// 			locale: getLanguageFromURL() || 'en',
// 			disabled_features: ['use_localstorage_for_settings'],
// 			enabled_features: ['study_templates'],
// 			charts_storage_url: defaultProps.chartsStorageUrl,
// 			charts_storage_api_version: defaultProps.chartsStorageApiVersion,
// 			client_id: defaultProps.clientId,
// 			user_id: defaultProps.userId,
// 			fullscreen: defaultProps.fullscreen,
// 			autosize: defaultProps.autosize,
// 			studies_overrides: defaultProps.studiesOverrides,
// 		}

// 		const tvWidget = new widget(widgetOptions)

// 		tvWidget.onChartReady(() => {
// 			tvWidget.headerReady().then(() => {
// 				const button = tvWidget.createButton()
// 				button.setAttribute('title', 'Click to show a notification popup')
// 				button.classList.add('apply-common-tooltip')
// 				button.addEventListener('click', () => tvWidget.showNoticeDialog({
// 					title: 'Notification',
// 					body: 'TradingView Charting Library API works correctly',
// 					callback: () => {
// 						console.log('Noticed!')
// 					},
// 				}))
// 				button.innerHTML = 'Check API'
// 			})
// 		})

// 		return () => {
// 			tvWidget.remove()
// 		}
// 	})

// 	return (
// 		<div
// 			ref={chartContainerRef}
// 			className={'TVChartContainer'}
// 		/>
// 	)
// }
