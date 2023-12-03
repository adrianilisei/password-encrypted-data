// import { DatafeedConfiguration, ResolutionString } from "tv-charting-library"


// const configurationData: DatafeedConfiguration = {
//     // Represents the resolutions for bars supported by your datafeed
//     supported_resolutions: ['1D', '1W', '1M'] as ResolutionString[],
//     // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
//     exchanges: [
//         { value: 'Binance', name: 'Binance', desc: 'Binance' }
//     ],
//     // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
//     symbols_types: [
//         { name: 'Crypto', value: 'crypto' }
//     ]
// }

// // Makes requests to CryptoCompare API
// export async function makeApiRequest(path: string) {
//     try {
//         const response = await fetch(`https://min-api.cryptocompare.com/${path}`)
//         return response.json()
//     } catch (error) {
//         throw new Error(`CryptoCompare request error: ${error?.status}`)
//     }
// }

// // Generates a symbol ID from a pair of the coins
// export function generateSymbol(exchange: string, fromSymbol: string, toSymbol: string) {
//     const short = `${fromSymbol}/${toSymbol}`
//     return {
//         short,
//         full: `${exchange}:${short}`,
//     }
// }

// export async function getAllSymbols() {
//     const data = await makeApiRequest('data/v3/all/exchanges')
//     let allSymbols = []

//     for (const exchange of configurationData.exchanges ?? []) {
//         const pairs = data.Data[exchange.value].pairs

//         for (const leftPairPart of Object.keys(pairs)) {
//             const symbols = pairs[leftPairPart].map(rightPairPart => {
//                 const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart)
//                 return {
//                     symbol: symbol.short,
//                     full_name: symbol.full,
//                     description: symbol.short,
//                     exchange: exchange.value,
//                     type: 'crypto',
//                 }
//             })
//             allSymbols = [...allSymbols, ...symbols]
//         }
//     }
//     return allSymbols
// }

// // Returns all parts of the symbol
// export function parseFullSymbol(fullSymbol: string) {
//     const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/)
//     if (!match) {
//         return null
//     }
//     return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] }
// }