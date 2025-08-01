
//  ---------------------------------------------------------------------------

import Exchange from './abstract/blofin.js';
import { ExchangeError, ExchangeNotAvailable, ArgumentsRequired, BadRequest, InvalidOrder, AuthenticationError, RateLimitExceeded, InsufficientFunds } from './base/errors.js';
import { Precise } from './base/Precise.js';
import { TICK_SIZE } from './base/functions/number.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import type { Int, OrderSide, OrderType, Trade, OHLCV, Order, FundingRateHistory, OrderRequest, Str, Transaction, Ticker, OrderBook, Balances, Tickers, Market, Strings, Currency, Position, TransferEntry, Leverage, Leverages, MarginMode, Num, TradingFeeInterface, Dict, int, LedgerEntry, FundingRate } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class blofin
 * @augments Exchange
 */
export default class blofin extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'blofin',
            'name': 'BloFin',
            'countries': [ 'US' ],
            'version': 'v1',
            'rateLimit': 100,
            'pro': true,
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': true,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowMargin': false,
                'cancelAllOrders': false,
                'cancelOrder': true,
                'cancelOrders': true,
                'closeAllPositions': false,
                'closePosition': true,
                'createDepositAddress': false,
                'createMarketBuyOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': true,
                'createOrders': true,
                'createOrderWithTakeProfitAndStopLoss': true,
                'createPostOnlyOrder': false,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopLossOrder': true,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'createTakeProfitOrder': true,
                'createTriggerOrder': true,
                'editOrder': false,
                'fetchAccounts': false,
                'fetchBalance': true,
                'fetchBidsAsks': undefined,
                'fetchBorrowInterest': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchCanceledOrders': false,
                'fetchClosedOrder': false,
                'fetchClosedOrders': true,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDeposit': false,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': true,
                'fetchDepositsWithdrawals': false,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': false,
                'fetchFundingHistory': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': false,
                'fetchGreeks': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchL3OrderBook': false,
                'fetchLedger': true,
                'fetchLedgerEntry': undefined,
                'fetchLeverage': true,
                'fetchLeverages': true,
                'fetchLeverageTiers': false,
                'fetchMarginMode': true,
                'fetchMarginModes': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMySettlementHistory': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrder': undefined,
                'fetchOpenOrders': true,
                'fetchOrder': undefined,
                'fetchOrderBook': true,
                'fetchOrderBooks': false,
                'fetchOrders': false,
                'fetchOrderTrades': true,
                'fetchPosition': true,
                'fetchPositionMode': true,
                'fetchPositions': true,
                'fetchPositionsForSymbol': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchSettlementHistory': false,
                'fetchStatus': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': false,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTradingLimits': false,
                'fetchTransactionFee': false,
                'fetchTransactionFees': false,
                'fetchTransactions': false,
                'fetchTransfer': false,
                'fetchTransfers': false,
                'fetchUnderlyingAssets': false,
                'fetchVolatilityHistory': false,
                'fetchWithdrawal': false,
                'fetchWithdrawals': true,
                'fetchWithdrawalWhitelist': false,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'setLeverage': true,
                'setMargin': false,
                'setMarginMode': true,
                'setPositionMode': true,
                'signIn': false,
                'transfer': true,
                'withdraw': false,
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1H',
                '2h': '2H',
                '4h': '4H',
                '6h': '6H',
                '8h': '8H',
                '12h': '12H',
                '1d': '1D',
                '3d': '3D',
                '1w': '1W',
                '1M': '1M',
            },
            'hostname': 'www.blofin.com',
            'urls': {
                'logo': 'https://github.com/user-attachments/assets/518cdf80-f05d-4821-a3e3-d48ceb41d73b',
                'api': {
                    'rest': 'https://openapi.blofin.com',
                },
                'test': {
                    'rest': 'https://demo-trading-openapi.blofin.com',
                },
                'referral': {
                    'url': 'https://blofin.com/register?referral_code=f79EsS',
                    'discount': 0.05,
                },
                'www': 'https://www.blofin.com',
                'doc': 'https://blofin.com/docs',
            },
            'api': {
                'public': {
                    'get': {
                        'market/instruments': 1,
                        'market/tickers': 1,
                        'market/books': 1,
                        'market/trades': 1,
                        'market/candles': 1,
                        'market/mark-price': 1,
                        'market/funding-rate': 1,
                        'market/funding-rate-history': 1,
                    },
                },
                'private': {
                    'get': {
                        'asset/balances': 1,
                        'trade/orders-pending': 1,
                        'trade/fills-history': 1,
                        'asset/deposit-history': 1,
                        'asset/withdrawal-history': 1,
                        'asset/bills': 1,
                        'account/balance': 1,
                        'account/positions': 1,
                        'account/leverage-info': 1,
                        'account/margin-mode': 1,
                        'account/position-mode': 1,
                        'account/batch-leverage-info': 1,
                        'trade/orders-tpsl-pending': 1,
                        'trade/orders-algo-pending': 1,
                        'trade/orders-history': 1,
                        'trade/orders-tpsl-history': 1,
                        'trade/orders-algo-history': 1, // todo new
                        'trade/order/price-range': 1,
                        'user/query-apikey': 1,
                        'affiliate/basic': 1,
                        'copytrading/instruments': 1,
                        'copytrading/account/balance': 1,
                        'copytrading/account/positions-by-order': 1,
                        'copytrading/account/positions-details-by-order': 1,
                        'copytrading/account/positions-by-contract': 1,
                        'copytrading/account/position-mode': 1,
                        'copytrading/account/leverage-info': 1,
                        'copytrading/trade/orders-pending': 1,
                        'copytrading/trade/pending-tpsl-by-contract': 1,
                        'copytrading/trade/position-history-by-order': 1,
                        'copytrading/trade/orders-history': 1,
                        'copytrading/trade/pending-tpsl-by-order': 1,
                    },
                    'post': {
                        'account/set-margin-mode': 1,
                        'account/set-position-mode': 1,
                        'trade/order': 1,
                        'trade/order-algo': 1,
                        'trade/cancel-order': 1,
                        'trade/cancel-algo': 1,
                        'account/set-leverage': 1,
                        'trade/batch-orders': 1,
                        'trade/order-tpsl': 1,
                        'trade/cancel-batch-orders': 1,
                        'trade/cancel-tpsl': 1,
                        'trade/close-position': 1,
                        'asset/transfer': 1,
                        'copytrading/account/set-position-mode': 1,
                        'copytrading/account/set-leverage': 1,
                        'copytrading/trade/place-order': 1,
                        'copytrading/trade/cancel-order': 1,
                        'copytrading/trade/place-tpsl-by-contract': 1,
                        'copytrading/trade/cancel-tpsl-by-contract': 1,
                        'copytrading/trade/place-tpsl-by-order': 1,
                        'copytrading/trade/cancel-tpsl-by-order': 1,
                        'copytrading/trade/close-position-by-order': 1,
                        'copytrading/trade/close-position-by-contract': 1,
                    },
                },
            },
            'fees': {
                'swap': {
                    'taker': this.parseNumber ('0.00060'),
                    'maker': this.parseNumber ('0.00020'),
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'password': true,
            },
            'features': {
                'default': {
                    'sandbox': false,
                    'createOrder': {
                        'timeInForce': {
                            'IOC': true,
                            'FOK': true,
                            'PO': true,
                            'GTD': false,
                        },
                        'leverage': false,
                        'marketBuyRequiresPrice': false,
                        'marketBuyByCost': false,
                        'selfTradePrevention': false,
                        'trailing': false,
                        'iceberg': false,
                    },
                    'createOrders': {
                        'max': 10,
                    },
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'symbolRequired': false,
                    },
                    'fetchOrder': undefined,
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': 100,
                        'trigger': true,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOrders': undefined,
                    'fetchClosedOrders': {
                        'marginMode': false,
                        'limit': 1000,
                        'daysBack': 100000,
                        'daysBackCanceled': 1,
                        'untilDays': 100000,
                        'trigger': true,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOHLCV': {
                        'limit': 1440,
                    },
                },
                'spot': {
                    'extends': 'default',
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': false,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false,
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        'hedged': false,
                    },
                },
                'forDerivatives': {
                    'extends': 'default',
                    'createOrder': {
                        'marginMode': true,
                        'triggerPrice': false, // todo
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': true,
                        'takeProfitPrice': true,
                        'attachedStopLossTakeProfit': {
                            'triggerPriceType': undefined,
                            'price': true,
                        },
                        'hedged': true,
                    },
                },
                'swap': {
                    'linear': {
                        'extends': 'forDerivatives',
                    },
                    'inverse': undefined,
                },
                'future': {
                    'linear': undefined,
                    'inverse': undefined,
                },
            },
            'exceptions': {
                'exact': {
                    '400': BadRequest, // Body can not be empty
                    '401': AuthenticationError,  // Invalid signature
                    '500': ExchangeError,  // Internal Server Error
                    '404': BadRequest,  // not found
                    '405': BadRequest,  // Method Not Allowed
                    '406': BadRequest,  // Not Acceptable
                    '429': RateLimitExceeded,  // Too Many Requests
                    '152001': BadRequest,  // Parameter {} cannot be empty
                    '152002': BadRequest,  // Parameter {} error
                    '152003': BadRequest,  // Either parameter {} or {} is required
                    '152004': BadRequest,  // JSON syntax error
                    '152005': BadRequest,  // Parameter error: wrong or empty
                    '152006': InvalidOrder,  // Batch orders can be placed for up to 20 at once
                    '152007': InvalidOrder,  // Batch orders can only be placed with the same instId and marginMode
                    '152008': InvalidOrder,  // Only the same field is allowed for bulk cancellation of orders, orderId is preferred
                    '152009': InvalidOrder,  // {} must be a combination of numbers, letters, or underscores, and the maximum length of characters is 32
                    '150003': InvalidOrder,  // clientId already exist
                    '150004': InvalidOrder,  // Insufficient balance. please adjust the amount and try again
                    '542': InvalidOrder,  // Exceeded the maximum order size limit
                    '102002': InvalidOrder,  // Duplicate customized order ID
                    '102005': InvalidOrder,  // Position had been closed
                    '102014': InvalidOrder,  // Limit order exceeds maximum order size limit
                    '102015': InvalidOrder,  // Market order exceeds maximum order size limit
                    '102022': InvalidOrder,  // Failed to place order. You don’t have any positions of this contract. Turn off Reduce-only to continue.
                    '102037': InvalidOrder,  // TP trigger price should be higher than the latest trading price
                    '102038': InvalidOrder,  // SL trigger price should be lower than the latest trading price
                    '102039': InvalidOrder,  // TP trigger price should be lower than the latest trading price
                    '102040': InvalidOrder,  // SL trigger price should be higher than the latest trading price
                    '102047': InvalidOrder,  // Stop loss trigger price should be higher than the order price
                    '102048': InvalidOrder,  // stop loss trigger price must be higher than the best bid price
                    '102049': InvalidOrder,  // Take profit trigger price should be lower than the order price
                    '102050': InvalidOrder,  // stop loss trigger price must be lower than the best ask price
                    '102051': InvalidOrder,  // stop loss trigger price should be lower than the order price
                    '102052': InvalidOrder,  // take profit trigger price should be higher than the order price
                    '102053': InvalidOrder,  // take profit trigger price should be lower than the best bid price
                    '102054': InvalidOrder,  // take profit trigger price should be higher than the best ask price
                    '102055': InvalidOrder,  // stop loss trigger price should be lower than the best ask price
                    '102064': BadRequest,  // Buy price is not within the price limit (Minimum: 310.40; Maximum:1,629.40)
                    '102065': BadRequest,  // Sell price is not within the price limit
                    '102068': BadRequest,  // Cancel failed as the order has been filled, triggered, canceled or does not exist
                    '103013': ExchangeError,  // Internal error; unable to process your request. Please try again.
                    'Order failed. Insufficient USDT margin in account': InsufficientFunds,  // Insufficient USDT margin in account
                },
                'broad': {
                    'Internal Server Error': ExchangeNotAvailable, // {"code":500,"data":{},"detailMsg":"","error_code":"500","error_message":"Internal Server Error","msg":"Internal Server Error"}
                    'server error': ExchangeNotAvailable, // {"code":500,"data":{},"detailMsg":"","error_code":"500","error_message":"server error 1236805249","msg":"server error 1236805249"}
                },
            },
            'httpExceptions': {
                '429': ExchangeNotAvailable, // https://github.com/ccxt/ccxt/issues/9612
            },
            'precisionMode': TICK_SIZE,
            'options': {
                'brokerId': 'ec6dd3a7dd982d0b',
                'accountsByType': {
                    'swap': 'futures',
                    'funding': 'funding',
                    'future': 'futures',
                    'copy_trading': 'copy_trading',
                    'earn': 'earn',
                    'spot': 'spot',
                },
                'accountsById': {
                    'funding': 'funding',
                    'futures': 'swap',
                    'copy_trading': 'copy_trading',
                    'earn': 'earn',
                    'spot': 'spot',
                },
                'defaultNetwork': 'ERC20',
                'defaultNetworks': {
                    'ETH': 'ERC20',
                    'BTC': 'BTC',
                    'USDT': 'TRC20',
                },
                'networks': {
                    'BTC': 'Bitcoin',
                    'BEP20': 'BSC',
                    'ERC20': 'ERC20',
                    'TRC20': 'TRC20',
                },
                'fetchOpenInterestHistory': {
                    'timeframes': {
                        '5m': '5m',
                        '1h': '1H',
                        '8h': '8H',
                        '1d': '1D',
                        '5M': '5m',
                        '1H': '1H',
                        '8H': '8H',
                        '1D': '1D',
                    },
                },
                'fetchOHLCV': {
                    // 'type': 'Candles', // Candles or HistoryCandles, IndexCandles, MarkPriceCandles
                    'timezone': 'UTC', // UTC, HK
                },
                'fetchPositions': {
                    'method': 'privateGetAccountPositions', // privateGetAccountPositions or privateGetAccountPositionsHistory
                },
                'createOrder': 'privatePostTradeOrder', // or 'privatePostTradeOrderTpsl'
                'createMarketBuyOrderRequiresPrice': false,
                'fetchMarkets': [ 'swap' ],
                'defaultType': 'swap',
                'fetchLedger': {
                    'method': 'privateGetAssetBills',
                },
                'fetchOpenOrders': {
                    'method': 'privateGetTradeOrdersPending',
                },
                'cancelOrders': {
                    'method': 'privatePostTradeCancelBatchOrders',
                },
                'fetchCanceledOrders': {
                    'method': 'privateGetTradeOrdersHistory', // privateGetTradeOrdersTpslHistory
                },
                'fetchClosedOrders': {
                    'method': 'privateGetTradeOrdersHistory', // privateGetTradeOrdersTpslHistory
                },
                'withdraw': {
                    // a funding password credential is required by the exchange for the
                    // withdraw call (not to be confused with the api password credential)
                    'password': undefined,
                    'pwd': undefined, // password or pwd both work
                },
                'exchangeType': {
                    'spot': 'SPOT',
                    'swap': 'SWAP',
                    'SPOT': 'SPOT',
                    'SWAP': 'SWAP',
                },
            },
        });
    }

    /**
     * @method
     * @name blofin#fetchMarkets
     * @description retrieves data on all markets for blofin
     * @see https://blofin.com/docs#get-instruments
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        const response = await this.publicGetMarketInstruments (params);
        const data = this.safeList (response, 'data', []);
        return this.parseMarkets (data);
    }

    parseMarket (market: Dict): Market {
        const id = this.safeString (market, 'instId');
        const type = this.safeStringLower (market, 'instType');
        const spot = (type === 'spot');
        const future = (type === 'future');
        const swap = (type === 'swap');
        const option = (type === 'option');
        const contract = swap || future;
        const baseId = this.safeString (market, 'baseCurrency');
        const quoteId = this.safeString (market, 'quoteCurrency');
        const settleId = this.safeString (market, 'quoteCurrency');
        const settle = this.safeCurrencyCode (settleId);
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        let symbol = base + '/' + quote;
        if (swap) {
            symbol = symbol + ':' + settle;
        }
        const expiry = undefined;
        const strikePrice = undefined;
        const optionType = undefined;
        const tickSize = this.safeString (market, 'tickSize');
        const fees = this.safeDict2 (this.fees, type, 'trading', {});
        const taker = this.safeNumber (fees, 'taker');
        const maker = this.safeNumber (fees, 'maker');
        let maxLeverage = this.safeString (market, 'maxLeverage', '100');
        maxLeverage = Precise.stringMax (maxLeverage, '1');
        const isActive = (this.safeString (market, 'state') === 'live');
        return this.safeMarketStructure ({
            'id': id,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'baseId': baseId,
            'quoteId': quoteId,
            'settle': settle,
            'settleId': settleId,
            'type': type,
            'spot': spot,
            'option': option,
            'margin': spot && (Precise.stringGt (maxLeverage, '1')),
            'swap': swap,
            'future': future,
            'active': isActive,
            'taker': taker,
            'maker': maker,
            'contract': contract,
            'linear': contract ? (quoteId === settleId) : undefined,
            'inverse': contract ? (baseId === settleId) : undefined,
            'contractSize': contract ? this.safeNumber (market, 'contractValue') : undefined,
            'expiry': expiry,
            'expiryDatetime': expiry,
            'strike': strikePrice,
            'optionType': optionType,
            'created': this.safeInteger (market, 'listTime'),
            'precision': {
                'amount': this.safeNumber (market, 'lotSize'),
                'price': this.parseNumber (tickSize),
            },
            'limits': {
                'leverage': {
                    'min': this.parseNumber ('1'),
                    'max': this.parseNumber (maxLeverage),
                },
                'amount': {
                    'min': this.safeNumber (market, 'minSize'),
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'info': market,
        });
    }

    /**
     * @method
     * @name blofin#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://blofin.com/docs#get-order-book
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'instId': market['id'],
        };
        limit = (limit === undefined) ? 50 : limit;
        if (limit !== undefined) {
            request['size'] = limit; // max 100
        }
        const response = await this.publicGetMarketBooks (this.extend (request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "asks": [
        //                     ["0.07228","4.211619","0","2"], // price, amount, liquidated orders, total open orders
        //                     ["0.0723","299.880364","0","2"],
        //                     ["0.07231","3.72832","0","1"],
        //                 ],
        //                 "bids": [
        //                     ["0.07221","18.5","0","1"],
        //                     ["0.0722","18.5","0","1"],
        //                     ["0.07219","0.505407","0","1"],
        //                 ],
        //                 "ts": "1621438475342"
        //             }
        //         ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        const first = this.safeDict (data, 0, {});
        const timestamp = this.safeInteger (first, 'ts');
        return this.parseOrderBook (first, symbol, timestamp);
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        //
        // response similar for REST & WS
        //
        //     {
        //         instId: "ADA-USDT",
        //         ts: "1707736811486",
        //         last: "0.5315",
        //         lastSize: "4",
        //         askPrice: "0.5318",
        //         askSize: "248",
        //         bidPrice: "0.5315",
        //         bidSize: "63",
        //         open24h: "0.5555",
        //         high24h: "0.5563",
        //         low24h: "0.5315",
        //         volCurrency24h: "198560100",
        //         vol24h: "1985601",
        //     }
        //
        const timestamp = this.safeInteger (ticker, 'ts');
        const marketId = this.safeString (ticker, 'instId');
        market = this.safeMarket (marketId, market, '-');
        const symbol = market['symbol'];
        const last = this.safeString (ticker, 'last');
        const open = this.safeString (ticker, 'open24h');
        const spot = this.safeBool (market, 'spot', false);
        const quoteVolume = spot ? this.safeString (ticker, 'volCurrency24h') : undefined;
        const baseVolume = this.safeString (ticker, 'vol24h');
        const high = this.safeString (ticker, 'high24h');
        const low = this.safeString (ticker, 'low24h');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': high,
            'low': low,
            'bid': this.safeString (ticker, 'bidPrice'),
            'bidVolume': this.safeString (ticker, 'bidSize'),
            'ask': this.safeString (ticker, 'askPrice'),
            'askVolume': this.safeString (ticker, 'askSize'),
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'indexPrice': this.safeString (ticker, 'indexPrice'),
            'markPrice': this.safeString (ticker, 'markPrice'),
            'info': ticker,
        }, market);
    }

    /**
     * @method
     * @name blofin#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://blofin.com/docs#get-tickers
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'instId': market['id'],
        };
        const response = await this.publicGetMarketTickers (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        const first = this.safeDict (data, 0, {});
        return this.parseTicker (first, market);
    }

    /**
     * @method
     * @name blofin#fetchMarkPrice
     * @description fetches mark price for the market
     * @see https://docs.blofin.com/index.html#get-mark-price
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchMarkPrice (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetMarketMarkPrice (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        const first = this.safeDict (data, 0, {});
        return this.parseTicker (first, market);
    }

    /**
     * @method
     * @name blofin#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://blofin.com/docs#get-tickers
     * @param {string[]} [symbols] unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const response = await this.publicGetMarketTickers (params);
        const tickers = this.safeList (response, 'data', []);
        return this.parseTickers (tickers, symbols);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        //
        // fetch trades (response similar for REST & WS)
        //
        //   {
        //       "tradeId": "3263934920",
        //       "instId": "LTC-USDT",
        //       "price": "67.87",
        //       "size": "1",
        //       "side": "buy",
        //       "ts": "1707232020854"
        //   }
        //
        // my trades
        //   {
        //       "instId": "LTC-USDT",
        //       "tradeId": "1440847",
        //       "orderId": "2075705202",
        //       "fillPrice": "67.850000000000000000",
        //       "fillSize": "1.000000000000000000",
        //       "fillPnl": "0.000000000000000000",
        //       "side": "buy",
        //       "positionSide": "net",
        //       "fee": "0.040710000000000000",
        //       "ts": "1707224678878",
        //       "brokerId": ""
        //   }
        //
        const id = this.safeString (trade, 'tradeId');
        const marketId = this.safeString (trade, 'instId');
        market = this.safeMarket (marketId, market, '-');
        const symbol = market['symbol'];
        const timestamp = this.safeInteger (trade, 'ts');
        const price = this.safeString2 (trade, 'price', 'fillPrice');
        const amount = this.safeString2 (trade, 'size', 'fillSize');
        const side = this.safeString (trade, 'side');
        const orderId = this.safeString (trade, 'orderId');
        const feeCost = this.safeString (trade, 'fee');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = {
                'cost': feeCost,
                'currency': market['settle'],
            };
        }
        return this.safeTrade ({
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'id': id,
            'order': orderId,
            'type': undefined,
            'takerOrMaker': undefined,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': undefined,
            'fee': fee,
        }, market);
    }

    /**
     * @method
     * @name blofin#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @see https://blofin.com/docs#get-trades
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.paginate] *only applies to publicGetMarketHistoryTrades* default false, when true will automatically paginate by calling this endpoint multiple times
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchTrades', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallCursor ('fetchTrades', symbol, since, limit, params, 'tradeId', 'after', undefined, 100) as Trade[];
        }
        const market = this.market (symbol);
        const request: Dict = {
            'instId': market['id'],
        };
        let response = undefined;
        if (limit !== undefined) {
            request['limit'] = limit; // default 100
        }
        let method = undefined;
        [ method, params ] = this.handleOptionAndParams (params, 'fetchTrades', 'method', 'publicGetMarketTrades');
        if (method === 'publicGetMarketTrades') {
            response = await this.publicGetMarketTrades (this.extend (request, params));
        }
        const data = this.safeList (response, 'data', []);
        return this.parseTrades (data, market, since, limit);
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        //
        //     [
        //         "1678928760000", // timestamp
        //         "24341.4", // open
        //         "24344", // high
        //         "24313.2", // low
        //         "24323", // close
        //         "628", // contract volume
        //         "2.5819", // base volume
        //         "62800", // quote volume
        //         "0" // candlestick state
        //     ]
        //
        return [
            this.safeInteger (ohlcv, 0),
            this.safeNumber (ohlcv, 1),
            this.safeNumber (ohlcv, 2),
            this.safeNumber (ohlcv, 3),
            this.safeNumber (ohlcv, 4),
            this.safeNumber (ohlcv, 6),
        ];
    }

    /**
     * @method
     * @name blofin#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://blofin.com/docs#get-candlesticks
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest candle to fetch
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchOHLCV', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic ('fetchOHLCV', symbol, since, limit, timeframe, params, 100) as OHLCV[];
        }
        if (limit === undefined) {
            limit = 100; // default 100, max 100
        }
        const request: Dict = {
            'instId': market['id'],
            'bar': this.safeString (this.timeframes, timeframe, timeframe),
            'limit': limit,
        };
        const until = this.safeInteger (params, 'until');
        if (until !== undefined) {
            request['after'] = until;
            params = this.omit (params, 'until');
        }
        let response = undefined;
        response = await this.publicGetMarketCandles (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        return this.parseOHLCVs (data, market, timeframe, since, limit);
    }

    /**
     * @method
     * @name blofin#fetchFundingRateHistory
     * @description fetches historical funding rate prices
     * @see https://blofin.com/docs#get-funding-rate-history
     * @param {string} symbol unified symbol of the market to fetch the funding rate history for
     * @param {int} [since] timestamp in ms of the earliest funding rate to fetch
     * @param {int} [limit] the maximum amount of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure} to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {int} [params.until] timestamp in ms of the latest funding rate to fetch
     * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure}
     */
    async fetchFundingRateHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchFundingRateHistory() requires a symbol argument');
        }
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchFundingRateHistory', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic ('fetchFundingRateHistory', symbol, since, limit, '8h', params, 100) as FundingRateHistory[];
        }
        const market = this.market (symbol);
        const request: Dict = {
            'instId': market['id'],
        };
        if (since !== undefined) {
            request['before'] = Math.max (since - 1, 0);
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const until = this.safeInteger (params, 'until');
        if (until !== undefined) {
            request['after'] = until;
            params = this.omit (params, 'until');
        }
        const response = await this.publicGetMarketFundingRateHistory (this.extend (request, params));
        const rates = [];
        const data = this.safeList (response, 'data', []);
        for (let i = 0; i < data.length; i++) {
            const rate = data[i];
            const timestamp = this.safeInteger (rate, 'fundingTime');
            rates.push ({
                'info': rate,
                'symbol': market['symbol'],
                'fundingRate': this.safeNumber (rate, 'fundingRate'),
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
            });
        }
        const sorted = this.sortBy (rates, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, market['symbol'], since, limit) as FundingRateHistory[];
    }

    parseFundingRate (contract, market: Market = undefined): FundingRate {
        //
        //    {
        //        "fundingRate": "0.00027815",
        //        "fundingTime": "1634256000000",
        //        "instId": "BTC-USD-SWAP",
        //    }
        //
        const marketId = this.safeString (contract, 'instId');
        const symbol = this.safeSymbol (marketId, market);
        const fundingTime = this.safeInteger (contract, 'fundingTime');
        // > The current interest is 0.
        return {
            'info': contract,
            'symbol': symbol,
            'markPrice': undefined,
            'indexPrice': undefined,
            'interestRate': this.parseNumber ('0'),
            'estimatedSettlePrice': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'fundingRate': this.safeNumber (contract, 'fundingRate'),
            'fundingTimestamp': fundingTime,
            'fundingDatetime': this.iso8601 (fundingTime),
            'nextFundingRate': undefined,
            'nextFundingTimestamp': undefined,
            'nextFundingDatetime': undefined,
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
            'interval': undefined,
        } as FundingRate;
    }

    /**
     * @method
     * @name blofin#fetchFundingRate
     * @description fetch the current funding rate
     * @see https://blofin.com/docs#get-funding-rate
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
     */
    async fetchFundingRate (symbol: string, params = {}): Promise<FundingRate> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['swap']) {
            throw new ExchangeError (this.id + ' fetchFundingRate() is only valid for swap markets');
        }
        const request: Dict = {
            'instId': market['id'],
        };
        const response = await this.publicGetMarketFundingRate (this.extend (request, params));
        //
        //    {
        //        "code": "0",
        //        "data": [
        //            {
        //                "fundingRate": "0.00027815",
        //                "fundingTime": "1634256000000",
        //                "instId": "BTC-USD-SWAP",
        //            }
        //        ],
        //        "msg": ""
        //    }
        //
        const data = this.safeList (response, 'data', []);
        const entry = this.safeDict (data, 0, {});
        return this.parseFundingRate (entry, market);
    }

    parseBalanceByType (response) {
        const data = this.safeList (response, 'data');
        if ((data !== undefined) && Array.isArray (data)) {
            return this.parseFundingBalance (response);
        } else {
            return this.parseBalance (response);
        }
    }

    parseBalance (response) {
        //
        // "data" similar for REST & WS
        //
        // {
        //     "code": "0",
        //     "msg": "success",
        //     "data": {
        //         "ts": "1697021343571",
        //         "totalEquity": "10011254.077985990315787910",
        //         "isolatedEquity": "861.763132108800000000",
        //         "details": [
        //             {
        //                 "currency": "USDT",
        //                 "equity": "10014042.988958415234430699548",
        //                 "balance": "10013119.885958415234430699",
        //                 "ts": "1697021343571",
        //                 "isolatedEquity": "862.003200000000000000048",
        //                 "available": "9996399.4708691159703362725",
        //                 "availableEquity": "9996399.4708691159703362725",
        //                 "frozen": "15805.149672632597427761",
        //                 "orderFrozen": "14920.994472632597427761",
        //                 "equityUsd": "10011254.077985990315787910",
        //                 "isolatedUnrealizedPnl": "-22.151999999999999999952",
        //                 "bonus": "0" // present only in REST
        //                 "unrealizedPnl": "0" // present only in WS
        //             }
        //         ]
        //     }
        // }
        //
        const result: Dict = { 'info': response };
        const data = this.safeDict (response, 'data', {});
        const timestamp = this.safeInteger (data, 'ts');
        const details = this.safeList (data, 'details', []);
        for (let i = 0; i < details.length; i++) {
            const balance = details[i];
            const currencyId = this.safeString (balance, 'currency');
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            // it may be incorrect to use total, free and used for swap accounts
            const eq = this.safeString (balance, 'equity');
            const availEq = this.safeString (balance, 'available');
            if ((eq === undefined) || (availEq === undefined)) {
                account['free'] = this.safeString (balance, 'availableEquity');
                account['used'] = this.safeString (balance, 'frozen');
            } else {
                account['total'] = eq;
                account['free'] = availEq;
            }
            result[code] = account;
        }
        result['timestamp'] = timestamp;
        result['datetime'] = this.iso8601 (timestamp);
        return this.safeBalance (result);
    }

    parseFundingBalance (response) {
        //
        //  {
        //      "code": "0",
        //      "msg": "success",
        //      "data": [
        //          {
        //              "currency": "USDT",
        //              "balance": "10012514.919418081548717298",
        //              "available": "9872132.414278782284622898",
        //              "frozen": "138556.471805965930761067",
        //              "bonus": "0"
        //          }
        //      ]
        //  }
        //
        const result: Dict = { 'info': response };
        const data = this.safeList (response, 'data', []);
        for (let i = 0; i < data.length; i++) {
            const balance = data[i];
            const currencyId = this.safeString (balance, 'currency');
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            // it may be incorrect to use total, free and used for swap accounts
            account['total'] = this.safeString (balance, 'balance');
            account['free'] = this.safeString (balance, 'available');
            account['used'] = this.safeString (balance, 'frozen');
            result[code] = account;
        }
        return this.safeBalance (result);
    }

    parseTradingFee (fee: Dict, market: Market = undefined): TradingFeeInterface {
        return {
            'info': fee,
            'symbol': this.safeSymbol (undefined, market),
            // blofin returns the fees as negative values opposed to other exchanges, so the sign needs to be flipped
            'maker': this.parseNumber (Precise.stringNeg (this.safeString2 (fee, 'maker', 'makerU'))),
            'taker': this.parseNumber (Precise.stringNeg (this.safeString2 (fee, 'taker', 'takerU'))),
            'percentage': undefined,
            'tierBased': undefined,
        };
    }

    /**
     * @method
     * @name blofin#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://blofin.com/docs#get-balance
     * @see https://blofin.com/docs#get-futures-account-balance
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.accountType] the type of account to fetch the balance for, either 'funding' or 'futures'  or 'copy_trading' or 'earn'
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance (params = {}): Promise<Balances> {
        await this.loadMarkets ();
        let accountType = undefined;
        [ accountType, params ] = this.handleOptionAndParams2 (params, 'fetchBalance', 'accountType', 'type');
        const request: Dict = {
        };
        let response = undefined;
        if (accountType !== undefined && accountType !== 'swap') {
            const options = this.safeDict (this.options, 'accountsByType', {});
            const parsedAccountType = this.safeString (options, accountType, accountType);
            request['accountType'] = parsedAccountType;
            response = await this.privateGetAssetBalances (this.extend (request, params));
        } else {
            response = await this.privateGetAccountBalance (this.extend (request, params));
        }
        return this.parseBalanceByType (response);
    }

    createOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        const market = this.market (symbol);
        const request: Dict = {
            'instId': market['id'],
            'side': side,
            'orderType': type,
            'size': this.amountToPrecision (symbol, amount),
            'brokerId': this.safeString (this.options, 'brokerId', 'ec6dd3a7dd982d0b'),
        };
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('createOrder', params, 'cross');
        request['marginMode'] = marginMode;
        const triggerPrice = this.safeString (params, 'triggerPrice');
        const timeInForce = this.safeString (params, 'timeInForce', 'GTC');
        const isHedged = this.safeBool (params, 'hedged', false);
        if (isHedged) {
            request['positionSide'] = (side === 'buy') ? 'long' : 'short';
        }
        const isMarketOrder = type === 'market';
        params = this.omit (params, [ 'timeInForce' ]);
        const ioc = (timeInForce === 'IOC') || (type === 'ioc');
        const marketIOC = (isMarketOrder && ioc);
        if (isMarketOrder || marketIOC) {
            request['orderType'] = 'market';
        } else {
            const key = (triggerPrice !== undefined) ? 'orderPrice' : 'price';
            request[key] = this.priceToPrecision (symbol, price);
        }
        let postOnly = false;
        [ postOnly, params ] = this.handlePostOnly (isMarketOrder, type === 'post_only', params);
        if (postOnly) {
            request['type'] = 'post_only';
        }
        const stopLoss = this.safeDict (params, 'stopLoss');
        const takeProfit = this.safeDict (params, 'takeProfit');
        params = this.omit (params, [ 'stopLoss', 'takeProfit', 'hedged' ]);
        const isStopLoss = stopLoss !== undefined;
        const isTakeProfit = takeProfit !== undefined;
        if (isStopLoss || isTakeProfit) {
            if (isStopLoss) {
                const slTriggerPrice = this.safeString2 (stopLoss, 'triggerPrice', 'stopPrice');
                request['slTriggerPrice'] = this.priceToPrecision (symbol, slTriggerPrice);
                const slOrderPrice = this.safeString (stopLoss, 'price', '-1');
                request['slOrderPrice'] = this.priceToPrecision (symbol, slOrderPrice);
            }
            if (isTakeProfit) {
                const tpTriggerPrice = this.safeString2 (takeProfit, 'triggerPrice', 'stopPrice');
                request['tpTriggerPrice'] = this.priceToPrecision (symbol, tpTriggerPrice);
                const tpPrice = this.safeString (takeProfit, 'price', '-1');
                request['tpOrderPrice'] = this.priceToPrecision (symbol, tpPrice);
            }
        } else if (triggerPrice !== undefined) {
            request['orderType'] = 'trigger';
            request['triggerPrice'] = this.priceToPrecision (symbol, triggerPrice);
            if (isMarketOrder) {
                request['orderPrice'] = '-1';
            }
        }
        return this.extend (request, params);
    }

    parseOrderStatus (status: Str) {
        const statuses: Dict = {
            'canceled': 'canceled',
            'order_failed': 'canceled',
            'live': 'open',
            'partially_filled': 'open',
            'filled': 'closed',
            'effective': 'closed',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        //
        // response similar for REST & WS
        //
        // {
        //     "orderId": "2075628533",
        //     "clientOrderId": "",
        //     "instId": "LTC-USDT",
        //     "marginMode": "cross",
        //     "positionSide": "net",
        //     "side": "buy",
        //     "orderType": "market",
        //     "price": "0.000000000000000000",
        //     "size": "1.000000000000000000",
        //     "reduceOnly": "true",
        //     "leverage": "3",
        //     "state": "filled",
        //     "filledSize": "1.000000000000000000",
        //     "pnl": "-0.050000000000000000",
        //     "averagePrice": "68.110000000000000000",
        //     "fee": "0.040866000000000000",
        //     "createTime": "1706891359010",
        //     "updateTime": "1706891359098",
        //     "orderCategory": "normal",
        //     "tpTriggerPrice": null,
        //     "tpOrderPrice": null,
        //     "slTriggerPrice": null,
        //     "slOrderPrice": null,
        //     "cancelSource": "not_canceled",
        //     "cancelSourceReason": null,
        //     "brokerId": "ec6dd3a7dd982d0b"
        //     "filled_amount": "1.000000000000000000", // filledAmount in "ws" watchOrders
        //     "cancelSource": "", // only in WS
        //     "instType": "SWAP", // only in WS
        // }
        //
        const id = this.safeStringN (order, [ 'tpslId', 'orderId', 'algoId' ]);
        const timestamp = this.safeInteger (order, 'createTime');
        const lastUpdateTimestamp = this.safeInteger (order, 'updateTime');
        const lastTradeTimestamp = this.safeInteger (order, 'fillTime');
        const side = this.safeString (order, 'side');
        let type = this.safeString (order, 'orderType');
        let postOnly = undefined;
        let timeInForce = undefined;
        if (type === 'post_only') {
            postOnly = true;
            type = 'limit';
        } else if (type === 'fok') {
            timeInForce = 'FOK';
            type = 'limit';
        } else if (type === 'ioc') {
            timeInForce = 'IOC';
            type = 'limit';
        }
        const marketId = this.safeString (order, 'instId');
        market = this.safeMarket (marketId, market);
        const symbol = this.safeSymbol (marketId, market, '-');
        const filled = this.safeString (order, 'filledSize');
        const price = this.safeString2 (order, 'px', 'price');
        const average = this.safeString (order, 'averagePrice');
        const status = this.parseOrderStatus (this.safeString (order, 'state'));
        const feeCostString = this.safeString (order, 'fee');
        const amount = this.safeString (order, 'size');
        const leverage = this.safeString (order, 'leverage', '1');
        const contractSize = this.safeString (market, 'contractSize');
        const baseAmount = Precise.stringMul (contractSize, filled);
        let cost: Str = undefined;
        if (average !== undefined) {
            cost = Precise.stringMul (average, baseAmount);
            cost = Precise.stringDiv (cost, leverage);
        }
        // spot market buy: "sz" can refer either to base currency units or to quote currency units
        let fee = undefined;
        if (feeCostString !== undefined) {
            const feeCostSigned = Precise.stringAbs (feeCostString);
            const feeCurrencyId = this.safeString (order, 'feeCcy', 'USDT');
            const feeCurrencyCode = this.safeCurrencyCode (feeCurrencyId);
            fee = {
                'cost': this.parseNumber (feeCostSigned),
                'currency': feeCurrencyCode,
            };
        }
        let clientOrderId = this.safeString (order, 'clientOrderId');
        if ((clientOrderId !== undefined) && (clientOrderId.length < 1)) {
            clientOrderId = undefined; // fix empty clientOrderId string
        }
        const stopLossTriggerPrice = this.safeNumber (order, 'slTriggerPrice');
        const stopLossPrice = this.safeNumber (order, 'slOrderPrice');
        const takeProfitTriggerPrice = this.safeNumber (order, 'tpTriggerPrice');
        const takeProfitPrice = this.safeNumber (order, 'tpOrderPrice');
        const reduceOnlyRaw = this.safeString (order, 'reduceOnly');
        const reduceOnly = (reduceOnlyRaw === 'true');
        return this.safeOrder ({
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'lastUpdateTimestamp': lastUpdateTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': postOnly,
            'side': side,
            'price': price,
            'stopLossTriggerPrice': stopLossTriggerPrice,
            'takeProfitTriggerPrice': takeProfitTriggerPrice,
            'stopLossPrice': stopLossPrice,
            'takeProfitPrice': takeProfitPrice,
            'average': average,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': fee,
            'trades': undefined,
            'reduceOnly': reduceOnly,
        }, market);
    }

    /**
     * @method
     * @name blofin#createOrder
     * @description create a trade order
     * @see https://blofin.com/docs#place-order
     * @see https://blofin.com/docs#place-tpsl-order
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit' or 'post_only' or 'ioc' or 'fok'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.triggerPrice] the trigger price for a trigger order
     * @param {bool} [params.reduceOnly] a mark to reduce the position size for margin, swap and future orders
     * @param {bool} [params.postOnly] true to place a post only order
     * @param {string} [params.marginMode] 'cross' or 'isolated', default is 'cross'
     * @param {float} [params.stopLossPrice] stop loss trigger price (will use privatePostTradeOrderTpsl)
     * @param {float} [params.takeProfitPrice] take profit trigger price (will use privatePostTradeOrderTpsl)
     * @param {string} [params.positionSide] *stopLossPrice/takeProfitPrice orders only* 'long' or 'short' or 'net' default is 'net'
     * @param {boolean} [params.hedged] if true, the positionSide will be set to long/short instead of net, default is false
     * @param {string} [params.clientOrderId] a unique id for the order
     * @param {object} [params.takeProfit] *takeProfit object in params* containing the triggerPrice at which the attached take profit order will be triggered
     * @param {float} [params.takeProfit.triggerPrice] take profit trigger price
     * @param {float} [params.takeProfit.price] take profit order price (if not provided the order will be a market order)
     * @param {object} [params.stopLoss] *stopLoss object in params* containing the triggerPrice at which the attached stop loss order will be triggered
     * @param {float} [params.stopLoss.triggerPrice] stop loss trigger price
     * @param {float} [params.stopLoss.price] stop loss order price (if not provided the order will be a market order)
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}): Promise<Order> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const tpsl = this.safeBool (params, 'tpsl', false);
        params = this.omit (params, 'tpsl');
        let method = undefined;
        [ method, params ] = this.handleOptionAndParams (params, 'createOrder', 'method', 'privatePostTradeOrder');
        const isStopLossPriceDefined = this.safeString (params, 'stopLossPrice') !== undefined;
        const isTakeProfitPriceDefined = this.safeString (params, 'takeProfitPrice') !== undefined;
        const isTriggerOrder = this.safeString (params, 'triggerPrice') !== undefined;
        const isType2Order = (isStopLossPriceDefined || isTakeProfitPriceDefined);
        let response = undefined;
        const reduceOnly = this.safeBool (params, 'reduceOnly');
        if (reduceOnly !== undefined) {
            params['reduceOnly'] = reduceOnly ? 'true' : 'false';
        }
        if (tpsl || (method === 'privatePostTradeOrderTpsl') || isType2Order) {
            const tpslRequest = this.createTpslOrderRequest (symbol, type, side, amount, price, params);
            response = await this.privatePostTradeOrderTpsl (tpslRequest);
        } else if (isTriggerOrder || (method === 'privatePostTradeOrderAlgo')) {
            const triggerRequest = this.createOrderRequest (symbol, type, side, amount, price, params);
            response = await this.privatePostTradeOrderAlgo (triggerRequest);
        } else {
            const request = this.createOrderRequest (symbol, type, side, amount, price, params);
            response = await this.privatePostTradeOrder (request);
        }
        if (isTriggerOrder || (method === 'privatePostTradeOrderAlgo')) {
            const dataDict = this.safeDict (response, 'data', {});
            const triggerOrder = this.parseOrder (dataDict, market);
            return triggerOrder;
        }
        const data = this.safeList (response, 'data', []);
        const first = this.safeDict (data, 0);
        const order = this.parseOrder (first, market);
        order['type'] = type;
        order['side'] = side;
        return order;
    }

    createTpslOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: Num = undefined, price: Num = undefined, params = {}) {
        const market = this.market (symbol);
        const positionSide = this.safeString (params, 'positionSide', 'net');
        const request: Dict = {
            'instId': market['id'],
            'side': side,
            'positionSide': positionSide,
            'brokerId': this.safeString (this.options, 'brokerId', 'ec6dd3a7dd982d0b'),
        };
        if (amount !== undefined) {
            request['size'] = this.amountToPrecision (symbol, amount);
        }
        const marginMode = this.safeString (params, 'marginMode', 'cross'); // cross or isolated
        if (marginMode !== 'cross' && marginMode !== 'isolated') {
            throw new BadRequest (this.id + ' createTpslOrder() requires a marginMode parameter that must be either cross or isolated');
        }
        const stopLossPrice = this.safeString (params, 'stopLossPrice');
        const takeProfitPrice = this.safeString (params, 'takeProfitPrice');
        if (stopLossPrice !== undefined) {
            request['slTriggerPrice'] = this.priceToPrecision (symbol, stopLossPrice);
            if (type === 'market') {
                request['slOrderPrice'] = '-1';
            } else {
                request['slOrderPrice'] = this.priceToPrecision (symbol, price);
            }
        } else if (takeProfitPrice !== undefined) {
            request['tpTriggerPrice'] = this.priceToPrecision (symbol, takeProfitPrice);
            if (type === 'market') {
                request['tpOrderPrice'] = '-1';
            } else {
                request['tpOrderPrice'] = this.priceToPrecision (symbol, price);
            }
        }
        request['marginMode'] = marginMode;
        params = this.omit (params, [ 'stopLossPrice', 'takeProfitPrice' ]);
        return this.extend (request, params);
    }

    /**
     * @method
     * @name blofin#cancelOrder
     * @description cancels an open order
     * @see https://blofin.com/docs#cancel-order
     * @see https://blofin.com/docs#cancel-tpsl-order
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.trigger] True if cancelling a trigger/conditional
     * @param {boolean} [params.tpsl] True if cancelling a tpsl order
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'instId': market['id'],
        };
        const isTrigger = this.safeBoolN (params, [ 'trigger' ], false);
        const isTpsl = this.safeBool2 (params, 'tpsl', 'TPSL', false);
        const clientOrderId = this.safeString (params, 'clientOrderId');
        if (clientOrderId !== undefined) {
            request['clientOrderId'] = clientOrderId;
        } else {
            if (!isTrigger && !isTpsl) {
                request['orderId'] = id.toString ();
            } else if (isTpsl) {
                request['tpslId'] = id.toString ();
            } else if (isTrigger) {
                request['algoId'] = id.toString ();
            }
        }
        const query = this.omit (params, [ 'orderId', 'clientOrderId', 'stop', 'trigger', 'tpsl' ]);
        if (isTpsl) {
            const tpslResponse = await this.cancelOrders ([ id ], symbol, params);
            const first = this.safeDict (tpslResponse, 0);
            return first as Order;
        } else if (isTrigger) {
            const triggerResponse = await this.privatePostTradeCancelAlgo (this.extend (request, query));
            const triggerData = this.safeDict (triggerResponse, 'data');
            return this.parseOrder (triggerData, market);
        }
        const response = await this.privatePostTradeCancelOrder (this.extend (request, query));
        const data = this.safeList (response, 'data', []);
        const order = this.safeDict (data, 0);
        return this.parseOrder (order, market);
    }

    /**
     * @method
     * @name blofin#createOrders
     * @description create a list of trade orders
     * @see https://blofin.com/docs#place-multiple-orders
     * @param {Array} orders list of orders to create, each object should contain the parameters required by createOrder, namely symbol, type, side, amount, price and params
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrders (orders: OrderRequest[], params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        const ordersRequests = [];
        for (let i = 0; i < orders.length; i++) {
            const rawOrder = orders[i];
            const marketId = this.safeString (rawOrder, 'symbol');
            const type = this.safeString (rawOrder, 'type');
            const side = this.safeString (rawOrder, 'side');
            const amount = this.safeValue (rawOrder, 'amount');
            const price = this.safeValue (rawOrder, 'price');
            const orderParams = this.safeDict (rawOrder, 'params', {});
            const extendedParams = this.extend (orderParams, params); // the request does not accept extra params since it's a list, so we're extending each order with the common params
            const orderRequest = this.createOrderRequest (marketId, type, side, amount, price, extendedParams);
            ordersRequests.push (orderRequest);
        }
        const response = await this.privatePostTradeBatchOrders (ordersRequests);
        const data = this.safeList (response, 'data', []);
        return this.parseOrders (data);
    }

    /**
     * @method
     * @name blofin#fetchOpenOrders
     * @description Fetch orders that are still open
     * @see https://blofin.com/docs#get-active-orders
     * @see https://blofin.com/docs#get-active-tpsl-orders
     * @see https://docs.blofin.com/index.html#get-active-algo-orders
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of  open orders structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {bool} [params.trigger] True if fetching trigger or conditional orders
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchOpenOrders', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchOpenOrders', symbol, since, limit, params) as Order[];
        }
        const request: Dict = {
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['instId'] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        const isTrigger = this.safeBoolN (params, [ 'stop', 'trigger' ], false);
        const isTpSl = this.safeBool2 (params, 'tpsl', 'TPSL', false);
        let method: Str = undefined;
        [ method, params ] = this.handleOptionAndParams (params, 'fetchOpenOrders', 'method', 'privateGetTradeOrdersPending');
        const query = this.omit (params, [ 'method', 'stop', 'trigger', 'tpsl', 'TPSL' ]);
        let response = undefined;
        if (isTpSl || (method === 'privateGetTradeOrdersTpslPending')) {
            response = await this.privateGetTradeOrdersTpslPending (this.extend (request, query));
        } else if (isTrigger || (method === 'privateGetTradeOrdersAlgoPending')) {
            request['orderType'] = 'trigger';
            response = await this.privateGetTradeOrdersAlgoPending (this.extend (request, query));
        } else {
            response = await this.privateGetTradeOrdersPending (this.extend (request, query));
        }
        const data = this.safeList (response, 'data', []);
        return this.parseOrders (data, market, since, limit);
    }

    /**
     * @method
     * @name blofin#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://blofin.com/docs#get-trade-history
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] Timestamp in ms of the latest time to retrieve trades for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchMyTrades', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchMyTrades', symbol, since, limit, params) as Trade[];
        }
        let request: Dict = {
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['instId'] = market['id'];
        }
        [ request, params ] = this.handleUntilOption ('end', request, params);
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        const response = await this.privateGetTradeFillsHistory (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        return this.parseTrades (data, market, since, limit);
    }

    /**
     * @method
     * @name blofin#fetchDeposits
     * @description fetch all deposits made to an account
     * @see https://blofin.com/docs#get-deposite-history
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch deposits for
     * @param {int} [limit] the maximum number of deposits structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch entries for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDeposits (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchDeposits', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchDeposits', code, since, limit, params);
        }
        let request: Dict = {
        };
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
            request['currency'] = currency['id'];
        }
        if (since !== undefined) {
            request['before'] = Math.max (since - 1, 0);
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        [ request, params ] = this.handleUntilOption ('after', request, params);
        const response = await this.privateGetAssetDepositHistory (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        return this.parseTransactions (data, currency, since, limit, params);
    }

    /**
     * @method
     * @name blofin#fetchWithdrawals
     * @description fetch all withdrawals made from an account
     * @see https://blofin.com/docs#get-withdraw-history
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch withdrawals for
     * @param {int} [limit] the maximum number of withdrawals structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch entries for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchWithdrawals (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchWithdrawals', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchWithdrawals', code, since, limit, params);
        }
        let request: Dict = {
        };
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
            request['currency'] = currency['id'];
        }
        if (since !== undefined) {
            request['before'] = Math.max (since - 1, 0);
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        [ request, params ] = this.handleUntilOption ('after', request, params);
        const response = await this.privateGetAssetWithdrawalHistory (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        return this.parseTransactions (data, currency, since, limit, params);
    }

    /**
     * @method
     * @name blofin#fetchLedger
     * @description fetch the history of changes, actions done by the user or operations that altered the balance of the user
     * @see https://blofin.com/docs#get-funds-transfer-history
     * @param {string} [code] unified currency code, default is undefined
     * @param {int} [since] timestamp in ms of the earliest ledger entry, default is undefined
     * @param {int} [limit] max number of ledger entries to return, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated'
     * @param {int} [params.until] the latest time in ms to fetch entries for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/#/?id=ledger}
     */
    async fetchLedger (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<LedgerEntry[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchLedger', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchLedger', code, since, limit, params) as LedgerEntry[];
        }
        let request: Dict = {
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
            request['currency'] = currency['id'];
        }
        [ request, params ] = this.handleUntilOption ('end', request, params);
        let response = undefined;
        response = await this.privateGetAssetBills (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        return this.parseLedger (data, currency, since, limit);
    }

    parseTransaction (transaction: Dict, currency: Currency = undefined): Transaction {
        //
        //
        // fetchDeposits
        //
        //     {
        //         "currency": "USDT",
        //         "chain": "TRC20",
        //         "address": "TGfJLtnsh3B9EqekFEBZ1nR14QanBUf5Bi",
        //         "txId": "892f4e0c32268b29b2e541ef30d32a30bbf10f902adcc4b1428319ed7c3758fd",
        //         "type": "0",
        //         "amount": "86.975843",
        //         "state": "1",
        //         "ts": "1703163304153",
        //         "tag": null,
        //         "confirm": "16",
        //         "depositId": "36c8e2a7ea184a219de72215a696acaf"
        //     }
        // fetchWithdrawals
        //    {
        //       "currency": "USDT",
        //        "chain": "TRC20",
        //        "address": "TYgB3sVXHPEDQUu288EG1uMFh9Pk2swLgW",
        //        "txId": "1fd5ac52df414d7ea66194cadd9a5b4d2422c2b9720037f66d98207f9858fd96",
        //        "type": "0",
        //        "amount": "9",
        //        "fee": "1",
        //        "feeCurrency": "USDT",
        //        "state": "3",
        //        "clientId": null,
        //        "ts": "1707217439351",
        //        "tag": null,
        //        "memo": null,
        //        "withdrawId": "e0768698cfdf4aee8e54654c3775914b"
        //    }
        //
        let type = undefined;
        let id = undefined;
        const withdrawalId = this.safeString (transaction, 'withdrawId');
        const depositId = this.safeString (transaction, 'depositId');
        const addressTo = this.safeString (transaction, 'address');
        const address = addressTo;
        const tagTo = this.safeString (transaction, 'tag');
        if (withdrawalId !== undefined) {
            type = 'withdrawal';
            id = withdrawalId;
        } else {
            id = depositId;
            type = 'deposit';
        }
        const currencyId = this.safeString (transaction, 'currency');
        const code = this.safeCurrencyCode (currencyId);
        const amount = this.safeNumber (transaction, 'amount');
        const status = this.parseTransactionStatus (this.safeString (transaction, 'state'));
        const txid = this.safeString (transaction, 'txId');
        const timestamp = this.safeInteger (transaction, 'ts');
        const feeCurrencyId = this.safeString (transaction, 'feeCurrency');
        const feeCode = this.safeCurrencyCode (feeCurrencyId);
        const feeCost = this.safeNumber (transaction, 'fee');
        return {
            'info': transaction,
            'id': id,
            'currency': code,
            'amount': amount,
            'network': undefined,
            'addressFrom': undefined,
            'addressTo': addressTo,
            'address': address,
            'tagFrom': undefined,
            'tagTo': tagTo,
            'tag': tagTo,
            'status': status,
            'type': type,
            'updated': undefined,
            'txid': txid,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'internal': undefined,
            'comment': undefined,
            'fee': {
                'currency': feeCode,
                'cost': feeCost,
            },
        };
    }

    parseTransactionStatus (status: Str) {
        const statuses: Dict = {
            '0': 'pending',
            '1': 'ok',
            '2': 'failed',
            '3': 'pending',
        };
        return this.safeString (statuses, status, status);
    }

    parseLedgerEntryType (type) {
        const types: Dict = {
            '1': 'transfer', // transfer
            '2': 'trade', // trade
            '3': 'trade', // delivery
            '4': 'rebate', // auto token conversion
            '5': 'trade', // liquidation
            '6': 'transfer', // margin transfer
            '7': 'trade', // interest deduction
            '8': 'fee', // funding rate
            '9': 'trade', // adl
            '10': 'trade', // clawback
            '11': 'trade', // system token conversion
        };
        return this.safeString (types, type, type);
    }

    parseLedgerEntry (item: Dict, currency: Currency = undefined): LedgerEntry {
        const currencyId = this.safeString (item, 'currency');
        const code = this.safeCurrencyCode (currencyId, currency);
        currency = this.safeCurrency (currencyId, currency);
        const timestamp = this.safeInteger (item, 'ts');
        return this.safeLedgerEntry ({
            'info': item,
            'id': this.safeString (item, 'transferId'),
            'direction': undefined,
            'account': undefined,
            'referenceId': this.safeString (item, 'clientId'),
            'referenceAccount': undefined,
            'type': this.parseLedgerEntryType (this.safeString (item, 'type')),
            'currency': code,
            'amount': this.safeNumber (item, 'amount'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'before': undefined,
            'after': undefined,
            'status': 'ok',
            'fee': undefined,
        }, currency) as LedgerEntry;
    }

    parseIds (ids) {
        /**
         * @ignore
         * @method
         * @name blofin#parseIds
         * @param {string[]|string} ids order ids
         * @returns {string[]} list of order ids
         */
        if (typeof ids === 'string') {
            return ids.split (',');
        } else {
            return ids;
        }
    }

    /**
     * @method
     * @name blofin#cancelOrders
     * @description cancel multiple orders
     * @see https://blofin.com/docs#cancel-multiple-orders
     * @param {string[]} ids order ids
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.trigger] whether the order is a stop/trigger order
     * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrders (ids, symbol: Str = undefined, params = {}) {
        // TODO : the original endpoint signature differs, according to that you can skip individual symbol and assign ids in batch. At this moment, `params` is not being used too.
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = [];
        const options = this.safeDict (this.options, 'cancelOrders', {});
        const defaultMethod = this.safeString (options, 'method', 'privatePostTradeCancelBatchOrders');
        let method = this.safeString (params, 'method', defaultMethod);
        const clientOrderIds = this.parseIds (this.safeValue (params, 'clientOrderId'));
        const tpslIds = this.parseIds (this.safeValue (params, 'tpslId'));
        const trigger = this.safeBoolN (params, [ 'stop', 'trigger', 'tpsl' ]);
        if (trigger) {
            method = 'privatePostTradeCancelTpsl';
        }
        if (clientOrderIds === undefined) {
            ids = this.parseIds (ids);
            if (tpslIds !== undefined) {
                for (let i = 0; i < tpslIds.length; i++) {
                    request.push ({
                        'tpslId': tpslIds[i],
                        'instId': market['id'],
                    });
                }
            }
            for (let i = 0; i < ids.length; i++) {
                if (trigger) {
                    request.push ({
                        'tpslId': ids[i],
                        'instId': market['id'],
                    });
                } else {
                    request.push ({
                        'orderId': ids[i],
                        'instId': market['id'],
                    });
                }
            }
        } else {
            for (let i = 0; i < clientOrderIds.length; i++) {
                request.push ({
                    'instId': market['id'],
                    'clientOrderId': clientOrderIds[i],
                });
            }
        }
        let response = undefined;
        if (method === 'privatePostTradeCancelTpsl') {
            response = await this.privatePostTradeCancelTpsl (request); // * dont extend with params, otherwise ARRAY will be turned into OBJECT
        } else {
            response = await this.privatePostTradeCancelBatchOrders (request); // * dont extend with params, otherwise ARRAY will be turned into OBJECT
        }
        const ordersData = this.safeList (response, 'data', []);
        return this.parseOrders (ordersData, market, undefined, undefined, params);
    }

    /**
     * @method
     * @name blofin#transfer
     * @description transfer currency internally between wallets on the same account
     * @see https://blofin.com/docs#funds-transfer
     * @param {string} code unified currency code
     * @param {float} amount amount to transfer
     * @param {string} fromAccount account to transfer from (funding, swap, copy_trading, earn)
     * @param {string} toAccount account to transfer to (funding, swap, copy_trading, earn)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=transfer-structure}
     */
    async transfer (code: string, amount: number, fromAccount: string, toAccount: string, params = {}): Promise<TransferEntry> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const accountsByType = this.safeDict (this.options, 'accountsByType', {});
        const fromId = this.safeString (accountsByType, fromAccount, fromAccount);
        const toId = this.safeString (accountsByType, toAccount, toAccount);
        const request: Dict = {
            'currency': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
            'fromAccount': fromId,
            'toAccount': toId,
        };
        const response = await this.privatePostAssetTransfer (this.extend (request, params));
        const data = this.safeDict (response, 'data', {});
        return this.parseTransfer (data, currency);
    }

    parseTransfer (transfer: Dict, currency: Currency = undefined): TransferEntry {
        const id = this.safeString (transfer, 'transferId');
        return {
            'info': transfer,
            'id': id,
            'timestamp': undefined,
            'datetime': undefined,
            'currency': undefined,
            'amount': undefined,
            'fromAccount': undefined,
            'toAccount': undefined,
            'status': undefined,
        };
    }

    /**
     * @method
     * @name blofin#fetchPosition
     * @description fetch data on a single open contract trade position
     * @see https://blofin.com/docs#get-positions
     * @param {string} symbol unified market symbol of the market the position is held in, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.instType] MARGIN, SWAP, FUTURES, OPTION
     * @returns {object} a [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async fetchPosition (symbol: string, params = {}): Promise<Position> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'instId': market['id'],
        };
        const response = await this.privateGetAccountPositions (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        const position = this.safeDict (data, 0);
        if (position === undefined) {
            return undefined;
        }
        return this.parsePosition (position, market);
    }

    /**
     * @method
     * @name blofin#fetchPositions
     * @description fetch data on a single open contract trade position
     * @see https://blofin.com/docs#get-positions
     * @param {string[]} [symbols] list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.instType] MARGIN, SWAP, FUTURES, OPTION
     * @returns {object} a [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async fetchPositions (symbols: Strings = undefined, params = {}): Promise<Position[]> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const response = await this.privateGetAccountPositions (params);
        const data = this.safeList (response, 'data', []);
        const result = this.parsePositions (data);
        return this.filterByArrayPositions (result, 'symbol', symbols, false);
    }

    parsePosition (position: Dict, market: Market = undefined) {
        //
        // response similar for REST & WS
        //
        //     {
        //         instType: 'SWAP',
        //         instId: 'LTC-USDT',
        //         marginMode: 'cross',
        //         positionId: '644159',
        //         positionSide: 'net',
        //         positions: '1',
        //         availablePositions: '1',
        //         averagePrice: '68.16',
        //         unrealizedPnl: '0.80631223',
        //         unrealizedPnlRatio: '0.03548909463028169',
        //         leverage: '3',
        //         liquidationPrice: '10.116655172370356435',
        //         markPrice: '68.96',
        //         initialMargin: '22.988770743333333333',
        //         margin: '', // this field might not exist in rest response
        //         marginRatio: '152.523509620342499273',
        //         maintenanceMargin: '0.34483156115',
        //         adl: '4',
        //         createTime: '1707235776528',
        //         updateTime: '1707235776528'
        //     }
        //
        const marketId = this.safeString (position, 'instId');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const pos = this.safeString (position, 'positions');
        const contractsAbs = Precise.stringAbs (pos);
        let side = this.safeString (position, 'positionSide');
        const hedged = side !== 'net';
        const contracts = this.parseNumber (contractsAbs);
        if (pos !== undefined) {
            if (side === 'net') {
                if (Precise.stringGt (pos, '0')) {
                    side = 'long';
                } else if (Precise.stringLt (pos, '0')) {
                    side = 'short';
                } else {
                    side = undefined;
                }
            }
        }
        const contractSize = this.safeNumber (market, 'contractSize');
        const contractSizeString = this.numberToString (contractSize);
        const markPriceString = this.safeString (position, 'markPrice');
        let notionalString = this.safeString (position, 'notionalUsd');
        if (market['inverse']) {
            notionalString = Precise.stringDiv (Precise.stringMul (contractsAbs, contractSizeString), markPriceString);
        }
        const notional = this.parseNumber (notionalString);
        const marginMode = this.safeString (position, 'marginMode');
        let initialMarginString = undefined;
        const entryPriceString = this.safeString (position, 'averagePrice');
        const unrealizedPnlString = this.safeString (position, 'unrealizedPnl');
        const leverageString = this.safeString (position, 'leverage');
        let initialMarginPercentage = undefined;
        let collateralString = undefined;
        if (marginMode === 'cross') {
            initialMarginString = this.safeString (position, 'initialMargin');
            collateralString = Precise.stringAdd (initialMarginString, unrealizedPnlString);
        } else if (marginMode === 'isolated') {
            initialMarginPercentage = Precise.stringDiv ('1', leverageString);
            collateralString = this.safeString (position, 'margin');
        }
        const maintenanceMarginString = this.safeString (position, 'maintenanceMargin');
        const maintenanceMargin = this.parseNumber (maintenanceMarginString);
        const maintenanceMarginPercentageString = Precise.stringDiv (maintenanceMarginString, notionalString);
        if (initialMarginPercentage === undefined) {
            initialMarginPercentage = this.parseNumber (Precise.stringDiv (initialMarginString, notionalString, 4));
        } else if (initialMarginString === undefined) {
            initialMarginString = Precise.stringMul (initialMarginPercentage, notionalString);
        }
        const rounder = '0.00005'; // round to closest 0.01%
        const maintenanceMarginPercentage = this.parseNumber (Precise.stringDiv (Precise.stringAdd (maintenanceMarginPercentageString, rounder), '1', 4));
        const liquidationPrice = this.safeNumber (position, 'liquidationPrice');
        const percentageString = this.safeString (position, 'unrealizedPnlRatio');
        const percentage = this.parseNumber (Precise.stringMul (percentageString, '100'));
        const timestamp = this.safeInteger (position, 'updateTime');
        const marginRatio = this.parseNumber (Precise.stringDiv (maintenanceMarginString, collateralString, 4));
        return this.safePosition ({
            'info': position,
            'id': undefined,
            'symbol': symbol,
            'notional': notional,
            'marginMode': marginMode,
            'liquidationPrice': liquidationPrice,
            'entryPrice': this.parseNumber (entryPriceString),
            'unrealizedPnl': this.parseNumber (unrealizedPnlString),
            'percentage': percentage,
            'contracts': contracts,
            'contractSize': contractSize,
            'markPrice': this.parseNumber (markPriceString),
            'lastPrice': undefined,
            'side': side,
            'hedged': hedged,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastUpdateTimestamp': undefined,
            'maintenanceMargin': maintenanceMargin,
            'maintenanceMarginPercentage': maintenanceMarginPercentage,
            'collateral': this.parseNumber (collateralString),
            'initialMargin': this.parseNumber (initialMarginString),
            'initialMarginPercentage': this.parseNumber (initialMarginPercentage),
            'leverage': this.parseNumber (leverageString),
            'marginRatio': marginRatio,
            'stopLossPrice': undefined,
            'takeProfitPrice': undefined,
        });
    }

    /**
     * @method
     * @name blofin#fetchLeverages
     * @description fetch the set leverage for all contract markets
     * @see https://docs.blofin.com/index.html#get-multiple-leverage
     * @param {string[]} symbols a list of unified market symbols, required on blofin
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated'
     * @returns {object} a list of [leverage structures]{@link https://docs.ccxt.com/#/?id=leverage-structure}
     */
    async fetchLeverages (symbols: Strings = undefined, params = {}): Promise<Leverages> {
        await this.loadMarkets ();
        if (symbols === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchLeverages() requires a symbols argument');
        }
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchLeverages', params);
        if (marginMode === undefined) {
            marginMode = this.safeString (params, 'marginMode', 'cross'); // cross as default marginMode
        }
        if ((marginMode !== 'cross') && (marginMode !== 'isolated')) {
            throw new BadRequest (this.id + ' fetchLeverages() requires a marginMode parameter that must be either cross or isolated');
        }
        symbols = this.marketSymbols (symbols);
        let instIds = '';
        for (let i = 0; i < symbols.length; i++) {
            const entry = symbols[i];
            const entryMarket = this.market (entry);
            if (i > 0) {
                instIds = instIds + ',' + entryMarket['id'];
            } else {
                instIds = instIds + entryMarket['id'];
            }
        }
        const request: Dict = {
            'instId': instIds,
            'marginMode': marginMode,
        };
        const response = await this.privateGetAccountBatchLeverageInfo (this.extend (request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "success",
        //         "data": [
        //             {
        //                 "leverage": "3",
        //                 "marginMode": "cross",
        //                 "instId": "BTC-USDT"
        //             },
        //         ]
        //     }
        //
        const leverages = this.safeList (response, 'data', []);
        return this.parseLeverages (leverages, symbols, 'instId');
    }

    /**
     * @method
     * @name blofin#fetchLeverage
     * @description fetch the set leverage for a market
     * @see https://docs.blofin.com/index.html#get-leverage
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated'
     * @returns {object} a [leverage structure]{@link https://docs.ccxt.com/#/?id=leverage-structure}
     */
    async fetchLeverage (symbol: string, params = {}): Promise<Leverage> {
        await this.loadMarkets ();
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchLeverage', params);
        if (marginMode === undefined) {
            marginMode = this.safeString (params, 'marginMode', 'cross'); // cross as default marginMode
        }
        if ((marginMode !== 'cross') && (marginMode !== 'isolated')) {
            throw new BadRequest (this.id + ' fetchLeverage() requires a marginMode parameter that must be either cross or isolated');
        }
        const market = this.market (symbol);
        const request: Dict = {
            'instId': market['id'],
            'marginMode': marginMode,
        };
        const response = await this.privateGetAccountLeverageInfo (this.extend (request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "success",
        //         "data": {
        //             "leverage": "3",
        //             "marginMode": "cross",
        //             "instId": "BTC-USDT"
        //         }
        //     }
        //
        const data = this.safeDict (response, 'data', {});
        return this.parseLeverage (data, market);
    }

    parseLeverage (leverage: Dict, market: Market = undefined): Leverage {
        const marketId = this.safeString (leverage, 'instId');
        const leverageValue = this.safeInteger (leverage, 'leverage');
        return {
            'info': leverage,
            'symbol': this.safeSymbol (marketId, market),
            'marginMode': this.safeStringLower (leverage, 'marginMode'),
            'longLeverage': leverageValue,
            'shortLeverage': leverageValue,
        } as Leverage;
    }

    /**
     * @method
     * @name blofin#setLeverage
     * @description set the level of leverage for a market
     * @see https://blofin.com/docs#set-leverage
     * @param {int} leverage the rate of leverage
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated'
     * @param {string} [params.positionSide] 'long' or 'short' - required for hedged mode in isolated margin
     * @returns {object} response from the exchange
     */
    async setLeverage (leverage: Int, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' setLeverage() requires a symbol argument');
        }
        // WARNING: THIS WILL INCREASE LIQUIDATION PRICE FOR OPEN ISOLATED LONG POSITIONS
        // AND DECREASE LIQUIDATION PRICE FOR OPEN ISOLATED SHORT POSITIONS
        if ((leverage < 1) || (leverage > 125)) {
            throw new BadRequest (this.id + ' setLeverage() leverage should be between 1 and 125');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('setLeverage', params, 'cross');
        if ((marginMode !== 'cross') && (marginMode !== 'isolated')) {
            throw new BadRequest (this.id + ' setLeverage() requires a marginMode parameter that must be either cross or isolated');
        }
        const request: Dict = {
            'leverage': leverage,
            'marginMode': marginMode,
            'instId': market['id'],
        };
        const response = await this.privatePostAccountSetLeverage (this.extend (request, params));
        return response;
    }

    /**
     * @method
     * @name blofin#closePosition
     * @description closes open positions for a market
     * @see https://blofin.com/docs#close-positions
     * @param {string} symbol Unified CCXT market symbol
     * @param {string} [side] 'buy' or 'sell', leave as undefined in net mode
     * @param {object} [params] extra parameters specific to the blofin api endpoint
     * @param {string} [params.clientOrderId] a unique identifier for the order
     * @param {string} [params.marginMode] 'cross' or 'isolated', default is 'cross;
     * @param {string} [params.code] *required in the case of closing cross MARGIN position for Single-currency margin* margin currency
     *
     * EXCHANGE SPECIFIC PARAMETERS
     * @param {boolean} [params.autoCxl] whether any pending orders for closing out needs to be automatically canceled when close position via a market order. false or true, the default is false
     * @param {string} [params.tag] order tag a combination of case-sensitive alphanumerics, all numbers, or all letters of up to 16 characters
     * @returns {object[]} [A list of position structures]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async closePosition (symbol: string, side: OrderSide = undefined, params = {}): Promise<Order> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const clientOrderId = this.safeString (params, 'clientOrderId');
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('closePosition', params, 'cross');
        const request: Dict = {
            'instId': market['id'],
            'marginMode': marginMode,
        };
        if (clientOrderId !== undefined) {
            request['clientOrderId'] = clientOrderId;
        }
        const response = await this.privatePostTradeClosePosition (this.extend (request, params));
        return this.safeDict (response, 'data') as Order;
    }

    /**
     * @method
     * @name blofin#fetchClosedOrders
     * @description fetches information on multiple closed orders made by the user
     * @see https://blofin.com/docs#get-order-history
     * @see https://blofin.com/docs#get-tpsl-order-history
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of  orde structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {bool} [params.trigger] True if fetching trigger or conditional orders
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchClosedOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchClosedOrders', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchClosedOrders', symbol, since, limit, params) as Order[];
        }
        const request: Dict = {
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['instId'] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        if (since !== undefined) {
            request['begin'] = since;
        }
        const isTrigger = this.safeBoolN (params, [ 'stop', 'trigger', 'tpsl', 'TPSL' ], false);
        let method: Str = undefined;
        [ method, params ] = this.handleOptionAndParams (params, 'fetchOpenOrders', 'method', 'privateGetTradeOrdersHistory');
        const query = this.omit (params, [ 'method', 'stop', 'trigger', 'tpsl', 'TPSL' ]);
        let response = undefined;
        if ((isTrigger) || (method === 'privateGetTradeOrdersTpslHistory')) {
            response = await this.privateGetTradeOrdersTpslHistory (this.extend (request, query));
        } else {
            response = await this.privateGetTradeOrdersHistory (this.extend (request, query));
        }
        const data = this.safeList (response, 'data', []);
        return this.parseOrders (data, market, since, limit);
    }

    /**
     * @method
     * @name blofin#fetchMarginMode
     * @description fetches the margin mode of a trading pair
     * @see https://docs.blofin.com/index.html#get-margin-mode
     * @param {string} symbol unified symbol of the market to fetch the margin mode for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin mode structure]{@link https://docs.ccxt.com/#/?id=margin-mode-structure}
     */
    async fetchMarginMode (symbol: string, params = {}): Promise<MarginMode> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const response = await this.privateGetAccountMarginMode (params);
        //
        //     {
        //         "code": "0",
        //         "msg": "success",
        //         "data": {
        //             "marginMode": "cross"
        //         }
        //     }
        //
        const data = this.safeDict (response, 'data', {});
        return this.parseMarginMode (data, market);
    }

    parseMarginMode (marginMode: Dict, market: Market = undefined): MarginMode {
        return {
            'info': marginMode,
            'symbol': this.safeString (market, 'symbol'),
            'marginMode': this.safeString (marginMode, 'marginMode'),
        } as MarginMode;
    }

    /**
     * @method
     * @name blofin#setMarginMode
     * @description set margin mode to 'cross' or 'isolated'
     * @see https://docs.blofin.com/index.html#set-margin-mode
     * @param {string} marginMode 'cross' or 'isolated'
     * @param {string} [symbol] unified market symbol (not used in blofin setMarginMode)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} response from the exchange
     */
    async setMarginMode (marginMode: string, symbol: Str = undefined, params = {}) {
        this.checkRequiredArgument ('setMarginMode', marginMode, 'marginMode', [ 'cross', 'isolated' ]);
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        const request: Dict = {
            'marginMode': marginMode,
        };
        const response = await this.privatePostAccountSetMarginMode (this.extend (request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "success",
        //         "data": {
        //             "marginMode": "isolated"
        //         }
        //     }
        //
        const data = this.safeDict (response, 'data', {});
        return this.parseMarginMode (data, market) as any;
    }

    /**
     * @method
     * @name blofin#fetchPositionMode
     * @description fetchs the position mode, hedged or one way
     * @see https://docs.blofin.com/index.html#get-position-mode
     * @param {string} [symbol] unified symbol of the market to fetch the position mode for (not used in blofin fetchPositionMode)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an object detailing whether the market is in hedged or one-way mode
     */
    async fetchPositionMode (symbol: Str = undefined, params = {}) {
        const response = await this.privateGetAccountPositionMode (params);
        const data = this.safeDict (response, 'data', {});
        const positionMode = this.safeString (data, 'positionMode');
        //
        //     {
        //         "code": "0",
        //         "msg": "success",
        //         "data": {
        //             "positionMode": "long_short_mode"
        //         }
        //     }
        //
        return {
            'info': data,
            'hedged': positionMode === 'long_short_mode',
        };
    }

    /**
     * @method
     * @name blofin#setPositionMode
     * @description set hedged to true or false for a market
     * @see https://docs.blofin.com/index.html#set-position-mode
     * @param {bool} hedged set to true to use hedged mode, false for one-way mode
     * @param {string} [symbol] not used by blofin setPositionMode ()
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} response from the exchange
     */
    async setPositionMode (hedged: boolean, symbol: Str = undefined, params = {}) {
        const request: Dict = {
            'positionMode': hedged ? 'long_short_mode' : 'net_mode',
        };
        //
        //     {
        //         "code": "0",
        //         "msg": "success",
        //         "data": {
        //             "positionMode": "net_mode"
        //         }
        //     }
        //
        return await this.privatePostAccountSetPositionMode (this.extend (request, params));
    }

    handleErrors (httpCode: int, reason: string, url: string, method: string, headers: Dict, body: string, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined; // fallback to default error handler
        }
        //
        // {"code":"152002","msg":"Parameter bar error."}
        //
        const code = this.safeString (response, 'code');
        const message = this.safeString (response, 'msg');
        const feedback = this.id + ' ' + body;
        if (code !== undefined && code !== '0') {
            this.throwExactlyMatchedException (this.exceptions['exact'], message, feedback);
            this.throwExactlyMatchedException (this.exceptions['exact'], code, feedback);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, feedback);
            throw new ExchangeError (feedback); // unknown message
        }
        //
        //  {
        //      orderId: null,
        //      clientOrderId: '',
        //      msg: 'Order failed. Insufficient USDT margin in account',
        //      code: '103003'
        //  }
        //
        const data = this.safeList (response, 'data');
        const first = this.safeDict (data, 0);
        const insideMsg = this.safeString (first, 'msg');
        const insideCode = this.safeString (first, 'code');
        if (insideCode !== undefined && insideCode !== '0') {
            this.throwExactlyMatchedException (this.exceptions['exact'], insideCode, feedback);
            this.throwExactlyMatchedException (this.exceptions['exact'], insideMsg, feedback);
            this.throwBroadlyMatchedException (this.exceptions['broad'], insideMsg, feedback);
        }
        return undefined;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = '/api/' + this.version + '/' + this.implodeParams (path, params);
        const query = this.omit (params, this.extractParams (path));
        let url = this.implodeHostname (this.urls['api']['rest']) + request;
        // const type = this.getPathAuthenticationType (path);
        if (api === 'public') {
            if (!this.isEmpty (query)) {
                url += '?' + this.urlencode (query);
            }
        } else if (api === 'private') {
            this.checkRequiredCredentials ();
            const timestamp = this.milliseconds ().toString ();
            headers = {
                'ACCESS-KEY': this.apiKey,
                'ACCESS-PASSPHRASE': this.password,
                'ACCESS-TIMESTAMP': timestamp,
                'ACCESS-NONCE': timestamp,
            };
            let sign_body = '';
            if (method === 'GET') {
                if (!this.isEmpty (query)) {
                    const urlencodedQuery = '?' + this.urlencode (query);
                    url += urlencodedQuery;
                    request += urlencodedQuery;
                }
            } else {
                if (!this.isEmpty (query)) {
                    body = this.json (query);
                    sign_body = body;
                }
                headers['Content-Type'] = 'application/json';
            }
            const auth = request + method + timestamp + timestamp + sign_body;
            const signature = this.stringToBase64 (this.hmac (this.encode (auth), this.encode (this.secret), sha256));
            headers['ACCESS-SIGN'] = signature;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
