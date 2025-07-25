'use strict';

var btcturk$1 = require('./abstract/btcturk.js');
var errors = require('./base/errors.js');
var Precise = require('./base/Precise.js');
var number = require('./base/functions/number.js');
var sha256 = require('./static_dependencies/noble-hashes/sha256.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
/**
 * @class btcturk
 * @augments Exchange
 */
class btcturk extends btcturk$1 {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'btcturk',
            'name': 'BTCTurk',
            'countries': ['TR'],
            'rateLimit': 100,
            'pro': false,
            'has': {
                'CORS': true,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowCrossMargin': false,
                'borrowIsolatedMargin': false,
                'borrowMargin': false,
                'cancelOrder': true,
                'closeAllPositions': false,
                'closePosition': false,
                'createDepositAddress': false,
                'createOrder': true,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createOrderWithTakeProfitAndStopLossWs': false,
                'createPostOnlyOrder': false,
                'createReduceOnlyOrder': false,
                'fetchBalance': true,
                'fetchBorrowInterest': false,
                'fetchBorrowRate': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchFundingHistory': false,
                'fetchFundingInterval': false,
                'fetchFundingIntervals': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchGreeks': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchIsolatedPositions': false,
                'fetchLeverage': false,
                'fetchLeverages': false,
                'fetchLeverageTiers': false,
                'fetchLiquidations': false,
                'fetchLongShortRatio': false,
                'fetchLongShortRatioHistory': false,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': false,
                'fetchMarginModes': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMarkPrices': false,
                'fetchMyLiquidations': false,
                'fetchMySettlementHistory': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenInterests': false,
                'fetchOpenOrders': true,
                'fetchOption': false,
                'fetchOptionChain': false,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsForSymbol': false,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchSettlementHistory': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTrades': true,
                'fetchVolatilityHistory': false,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'repayMargin': false,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'ws': false,
            },
            'timeframes': {
                '1m': 1,
                '15m': 15,
                '30m': 30,
                '1h': 60,
                '4h': 240,
                '1d': '1 d',
                '1w': '1 w',
                '1y': '1 y',
            },
            'urls': {
                'logo': 'https://github.com/user-attachments/assets/10e0a238-9f60-4b06-9dda-edfc7602f1d6',
                'api': {
                    'public': 'https://api.btcturk.com/api/v2',
                    'private': 'https://api.btcturk.com/api/v1',
                    'graph': 'https://graph-api.btcturk.com/v1',
                },
                'www': 'https://www.btcturk.com',
                'doc': 'https://github.com/BTCTrader/broker-api-docs',
            },
            'api': {
                'public': {
                    'get': {
                        'orderbook': 1,
                        'ticker': 0.1,
                        'trades': 1,
                        'ohlc': 1,
                        'server/exchangeinfo': 1,
                    },
                },
                'private': {
                    'get': {
                        'users/balances': 1,
                        'openOrders': 1,
                        'allOrders': 1,
                        'users/transactions/trade': 1,
                    },
                    'post': {
                        'users/transactions/crypto': 1,
                        'users/transactions/fiat': 1,
                        'order': 1,
                        'cancelOrder': 1,
                    },
                    'delete': {
                        'order': 1,
                    },
                },
                'graph': {
                    'get': {
                        'ohlcs': 1,
                        'klines/history': 1,
                    },
                },
            },
            'features': {
                'spot': {
                    'sandbox': false,
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': true,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false,
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        'timeInForce': {
                            'IOC': false,
                            'FOK': false,
                            'PO': false,
                            'GTD': false,
                        },
                        'hedged': false,
                        'leverage': false,
                        'marketBuyRequiresPrice': false,
                        'marketBuyByCost': false,
                        'selfTradePrevention': false,
                        'trailing': false,
                        'iceberg': false,
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': 100000,
                        'untilDays': 30,
                        'symbolRequired': true,
                    },
                    'fetchOrder': undefined,
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': undefined,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchOrders': {
                        'marginMode': false,
                        'limit': 1000,
                        'daysBack': 100000,
                        'untilDays': 30,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchClosedOrders': undefined,
                    'fetchOHLCV': {
                        'limit': undefined,
                    },
                },
                'swap': {
                    'linear': undefined,
                    'inverse': undefined,
                },
                'future': {
                    'linear': undefined,
                    'inverse': undefined,
                },
            },
            'fees': {
                'trading': {
                    'maker': this.parseNumber('0.0005'),
                    'taker': this.parseNumber('0.0009'),
                },
            },
            'exceptions': {
                'exact': {
                    'FAILED_ORDER_WITH_OPEN_ORDERS': errors.InsufficientFunds,
                    'FAILED_LIMIT_ORDER': errors.InvalidOrder,
                    'FAILED_MARKET_ORDER': errors.InvalidOrder,
                },
            },
            'precisionMode': number.TICK_SIZE,
        });
    }
    /**
     * @method
     * @name btcturk#fetchMarkets
     * @description retrieves data on all markets for btcturk
     * @see https://docs.btcturk.com/public-endpoints/exchange-info
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets(params = {}) {
        const response = await this.publicGetServerExchangeinfo(params);
        //
        //    {
        //        "data": {
        //            "timeZone": "UTC",
        //            "serverTime": "1618826678404",
        //            "symbols": [
        //                {
        //                    "id": "1",
        //                    "name": "BTCTRY",
        //                    "nameNormalized": "BTC_TRY",
        //                    "status": "TRADING",
        //                    "numerator": "BTC",
        //                    "denominator": "TRY",
        //                    "numeratorScale": "8",
        //                    "denominatorScale": "2",
        //                    "hasFraction": false,
        //                    "filters": [
        //                        {
        //                            "filterType": "PRICE_FILTER",
        //                            "minPrice": "0.0000000000001",
        //                            "maxPrice": "10000000",
        //                            "tickSize": "10",
        //                            "minExchangeValue": "99.92",
        //                            "minAmount": null,
        //                            "maxAmount": null
        //                        }
        //                    ],
        //                    "orderMethods": [
        //                        "MARKET",
        //                        "LIMIT",
        //                        "STOP_MARKET",
        //                        "STOP_LIMIT"
        //                    ],
        //                    "displayFormat": "#,###",
        //                    "commissionFromNumerator": false,
        //                    "order": "1000",
        //                    "priceRounding": false
        //                },
        //                ...
        //            },
        //        ],
        //    }
        //
        const data = this.safeDict(response, 'data', {});
        const markets = this.safeList(data, 'symbols', []);
        return this.parseMarkets(markets);
    }
    parseMarket(entry) {
        const id = this.safeString(entry, 'name');
        const baseId = this.safeString(entry, 'numerator');
        const quoteId = this.safeString(entry, 'denominator');
        const base = this.safeCurrencyCode(baseId);
        const quote = this.safeCurrencyCode(quoteId);
        const filters = this.safeList(entry, 'filters', []);
        let minPrice = undefined;
        let maxPrice = undefined;
        let minAmount = undefined;
        let maxAmount = undefined;
        let minCost = undefined;
        for (let j = 0; j < filters.length; j++) {
            const filter = filters[j];
            const filterType = this.safeString(filter, 'filterType');
            if (filterType === 'PRICE_FILTER') {
                minPrice = this.safeNumber(filter, 'minPrice');
                maxPrice = this.safeNumber(filter, 'maxPrice');
                minAmount = this.safeNumber(filter, 'minAmount');
                maxAmount = this.safeNumber(filter, 'maxAmount');
                minCost = this.safeNumber(filter, 'minExchangeValue');
            }
        }
        const status = this.safeString(entry, 'status');
        return {
            'id': id,
            'symbol': base + '/' + quote,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': undefined,
            'type': 'spot',
            'spot': true,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'active': (status === 'TRADING'),
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.parseNumber(this.parsePrecision(this.safeString(entry, 'numeratorScale'))),
                'price': this.parseNumber(this.parsePrecision(this.safeString(entry, 'denominatorScale'))),
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': minAmount,
                    'max': maxAmount,
                },
                'price': {
                    'min': minPrice,
                    'max': maxPrice,
                },
                'cost': {
                    'min': minCost,
                    'max': undefined,
                },
            },
            'created': undefined,
            'info': entry,
        };
    }
    parseBalance(response) {
        const data = this.safeList(response, 'data', []);
        const result = {
            'info': response,
            'timestamp': undefined,
            'datetime': undefined,
        };
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const currencyId = this.safeString(entry, 'asset');
            const code = this.safeCurrencyCode(currencyId);
            const account = this.account();
            account['total'] = this.safeString(entry, 'balance');
            account['free'] = this.safeString(entry, 'free');
            account['used'] = this.safeString(entry, 'locked');
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    /**
     * @method
     * @name btcturk#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://docs.btcturk.com/private-endpoints/account-balance
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance(params = {}) {
        await this.loadMarkets();
        const response = await this.privateGetUsersBalances(params);
        //
        //     {
        //       "data": [
        //         {
        //           "asset": "TRY",
        //           "assetname": "Türk Lirası",
        //           "balance": "0",
        //           "locked": "0",
        //           "free": "0",
        //           "orderFund": "0",
        //           "requestFund": "0",
        //           "precision": 2
        //         }
        //       ]
        //     }
        //
        return this.parseBalance(response);
    }
    /**
     * @method
     * @name btcturk#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://docs.btcturk.com/public-endpoints/orderbook
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'pairSymbol': market['id'],
        };
        const response = await this.publicGetOrderbook(this.extend(request, params));
        //     {
        //       "data": {
        //         "timestamp": 1618827901241,
        //         "bids": [
        //           [
        //             "460263.00",
        //             "0.04244000"
        //           ]
        //         ]
        //       }
        //     }
        const data = this.safeDict(response, 'data', {});
        const timestamp = this.safeInteger(data, 'timestamp');
        return this.parseOrderBook(data, market['symbol'], timestamp, 'bids', 'asks', 0, 1);
    }
    parseTicker(ticker, market = undefined) {
        //
        //   {
        //     "pair": "BTCTRY",
        //     "pairNormalized": "BTC_TRY",
        //     "timestamp": 1618826361234,
        //     "last": 462485,
        //     "high": 473976,
        //     "low": 444201,
        //     "bid": 461928,
        //     "ask": 462485,
        //     "open": 456915,
        //     "volume": 917.41368645,
        //     "average": 462868.29574589,
        //     "daily": 5570,
        //     "dailyPercent": 1.22,
        //     "denominatorSymbol": "TRY",
        //     "numeratorSymbol": "BTC",
        //     "order": 1000
        //   }
        //
        const marketId = this.safeString(ticker, 'pair');
        market = this.safeMarket(marketId, market);
        const symbol = market['symbol'];
        const timestamp = this.safeInteger(ticker, 'timestamp');
        const last = this.safeString(ticker, 'last');
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeString(ticker, 'high'),
            'low': this.safeString(ticker, 'low'),
            'bid': this.safeString(ticker, 'bid'),
            'bidVolume': undefined,
            'ask': this.safeString(ticker, 'ask'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': this.safeString(ticker, 'open'),
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': this.safeString(ticker, 'daily'),
            'percentage': this.safeString(ticker, 'dailyPercent'),
            'average': this.safeString(ticker, 'average'),
            'baseVolume': this.safeString(ticker, 'volume'),
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }
    /**
     * @method
     * @name btcturk#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://docs.btcturk.com/public-endpoints/ticker
     * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        const response = await this.publicGetTicker(params);
        const tickers = this.safeList(response, 'data');
        return this.parseTickers(tickers, symbols);
    }
    /**
     * @method
     * @name btcturk#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://docs.btcturk.com/public-endpoints/ticker
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker(symbol, params = {}) {
        await this.loadMarkets();
        const tickers = await this.fetchTickers([symbol], params);
        return this.safeValue(tickers, symbol);
    }
    parseTrade(trade, market = undefined) {
        //
        // fetchTrades
        //     {
        //       "pair": "BTCUSDT",
        //       "pairNormalized": "BTC_USDT",
        //       "numerator": "BTC",
        //       "denominator": "USDT",
        //       "date": "1618916879083",
        //       "tid": "637545136790672520",
        //       "price": "55774",
        //       "amount": "0.27917100",
        //       "side": "buy"
        //     }
        //
        // fetchMyTrades
        //     {
        //       "price": "56000",
        //       "numeratorSymbol": "BTC",
        //       "denominatorSymbol": "USDT",
        //       "orderType": "buy",
        //       "orderId": "2606935102",
        //       "id": "320874372",
        //       "timestamp": "1618916479593",
        //       "amount": "0.00020000",
        //       "fee": "0",
        //       "tax": "0"
        //     }
        //
        const timestamp = this.safeInteger2(trade, 'date', 'timestamp');
        const id = this.safeString2(trade, 'tid', 'id');
        const order = this.safeString(trade, 'orderId');
        const priceString = this.safeString(trade, 'price');
        const amountString = Precise["default"].stringAbs(this.safeString(trade, 'amount'));
        const marketId = this.safeString(trade, 'pair');
        const symbol = this.safeSymbol(marketId, market);
        const side = this.safeString2(trade, 'side', 'orderType');
        let fee = undefined;
        const feeAmountString = this.safeString(trade, 'fee');
        if (feeAmountString !== undefined) {
            const feeCurrency = this.safeString(trade, 'denominatorSymbol');
            fee = {
                'cost': Precise["default"].stringAbs(feeAmountString),
                'currency': this.safeCurrencyCode(feeCurrency),
            };
        }
        return this.safeTrade({
            'info': trade,
            'id': id,
            'order': order,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': undefined,
            'side': side,
            'takerOrMaker': undefined,
            'price': priceString,
            'amount': amountString,
            'cost': undefined,
            'fee': fee,
        }, market);
    }
    /**
     * @method
     * @name btcturk#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @see https://docs.btcturk.com/public-endpoints/trades
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        // let maxCount = 50;
        const request = {
            'pairSymbol': market['id'],
        };
        if (limit !== undefined) {
            request['last'] = limit;
        }
        const response = await this.publicGetTrades(this.extend(request, params));
        //
        //     {
        //       "data": [
        //         {
        //           "pair": "BTCTRY",
        //           "pairNormalized": "BTC_TRY",
        //           "numerator": "BTC",
        //           "denominator": "TRY",
        //           "date": 1618828421497,
        //           "tid": "637544252214980918",
        //           "price": "462585.00",
        //           "amount": "0.01618411",
        //           "side": "sell"
        //         }
        //       ]
        //     }
        //
        const data = this.safeList(response, 'data');
        return this.parseTrades(data, market, since, limit);
    }
    parseOHLCV(ohlcv, market = undefined) {
        //
        //    {
        //        "timestamp": 1661990400,
        //        "high": 368388.0,
        //        "open": 368388.0,
        //        "low": 368388.0,
        //        "close": 368388.0,
        //        "volume": 0.00035208,
        //    }
        //
        return [
            this.safeTimestamp(ohlcv, 'timestamp'),
            this.safeNumber(ohlcv, 'open'),
            this.safeNumber(ohlcv, 'high'),
            this.safeNumber(ohlcv, 'low'),
            this.safeNumber(ohlcv, 'close'),
            this.safeNumber(ohlcv, 'volume'),
        ];
    }
    /**
     * @method
     * @name btcturk#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://docs.btcturk.com/public-endpoints/get-kline-data
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest candle to fetch
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV(symbol, timeframe = '1h', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
            'resolution': this.safeValue(this.timeframes, timeframe, timeframe), // allows the user to pass custom timeframes if needed
        };
        const until = this.safeInteger(params, 'until', this.milliseconds());
        request['to'] = this.parseToInt((until / 1000));
        if (since !== undefined) {
            request['from'] = this.parseToInt(since / 1000);
        }
        else if (limit === undefined) { // since will also be undefined
            limit = 100; // default value
        }
        if (limit !== undefined) {
            limit = Math.min(limit, 11000); // max 11000 candles diapason can be covered
            if (timeframe === '1y') { // difficult with leap years
                throw new errors.BadRequest(this.id + ' fetchOHLCV () does not accept a limit parameter when timeframe == "1y"');
            }
            const seconds = this.parseTimeframe(timeframe);
            const limitSeconds = seconds * (limit - 1);
            if (since !== undefined) {
                const to = this.parseToInt(since / 1000) + limitSeconds;
                request['to'] = Math.min(request['to'], to);
            }
            else {
                request['from'] = this.parseToInt(0 / 1000) - limitSeconds;
            }
        }
        const response = await this.graphGetKlinesHistory(this.extend(request, params));
        //
        //    {
        //        "s": "ok",
        //        "t": [
        //          1661990400,
        //          1661990520,
        //          ...
        //        ],
        //        "h": [
        //          368388.0,
        //          369090.0,
        //          ...
        //        ],
        //        "o": [
        //          368388.0,
        //          368467.0,
        //          ...
        //        ],
        //        "l": [
        //          368388.0,
        //          368467.0,
        //          ...
        //        ],
        //        "c": [
        //          368388.0,
        //          369090.0,
        //          ...
        //        ],
        //        "v": [
        //          0.00035208,
        //          0.2972395,
        //          ...
        //        ]
        //    }
        //
        return this.parseOHLCVs(response, market, timeframe, since, limit);
    }
    parseOHLCVs(ohlcvs, market = undefined, timeframe = '1m', since = undefined, limit = undefined, tail = false) {
        const results = [];
        const timestamp = this.safeList(ohlcvs, 't', []);
        const high = this.safeList(ohlcvs, 'h', []);
        const open = this.safeList(ohlcvs, 'o', []);
        const low = this.safeList(ohlcvs, 'l', []);
        const close = this.safeList(ohlcvs, 'c', []);
        const volume = this.safeList(ohlcvs, 'v', []);
        for (let i = 0; i < timestamp.length; i++) {
            const ohlcv = {
                'timestamp': this.safeInteger(timestamp, i),
                'high': this.safeNumber(high, i),
                'open': this.safeNumber(open, i),
                'low': this.safeNumber(low, i),
                'close': this.safeNumber(close, i),
                'volume': this.safeNumber(volume, i),
            };
            results.push(this.parseOHLCV(ohlcv, market));
        }
        const sorted = this.sortBy(results, 0);
        return this.filterBySinceLimit(sorted, since, limit, 0, tail);
    }
    /**
     * @method
     * @name btcturk#createOrder
     * @description create a trade order
     * @see https://docs.btcturk.com/private-endpoints/submit-order
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'orderType': side,
            'orderMethod': type,
            'pairSymbol': market['id'],
            'quantity': this.amountToPrecision(symbol, amount),
        };
        if (type !== 'market') {
            request['price'] = this.priceToPrecision(symbol, price);
        }
        if ('clientOrderId' in params) {
            request['newClientOrderId'] = params['clientOrderId'];
        }
        else if (!('newClientOrderId' in params)) {
            request['newClientOrderId'] = this.uuid();
        }
        const response = await this.privatePostOrder(this.extend(request, params));
        const data = this.safeDict(response, 'data');
        return this.parseOrder(data, market);
    }
    /**
     * @method
     * @name btcturk#cancelOrder
     * @description cancels an open order
     * @see https://docs.btcturk.com/private-endpoints/cancel-order
     * @param {string} id order id
     * @param {string} symbol not used by btcturk cancelOrder ()
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder(id, symbol = undefined, params = {}) {
        const request = {
            'id': id,
        };
        const response = await this.privateDeleteOrder(this.extend(request, params));
        //
        //    {
        //        "success": true,
        //        "message": "SUCCESS",
        //        "code": 0
        //    }
        //
        return this.safeOrder({
            'info': response,
        });
    }
    /**
     * @method
     * @name btcturk#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @see https://docs.btcturk.com/private-endpoints/open-orders
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of  open orders structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['pairSymbol'] = market['id'];
        }
        const response = await this.privateGetOpenOrders(this.extend(request, params));
        const data = this.safeDict(response, 'data', {});
        const bids = this.safeList(data, 'bids', []);
        const asks = this.safeList(data, 'asks', []);
        return this.parseOrders(this.arrayConcat(bids, asks), market, since, limit);
    }
    /**
     * @method
     * @name btcturk#fetchOrders
     * @description fetches information on multiple orders made by the user
     * @see https://docs.btcturk.com/private-endpoints/all-orders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'pairSymbol': market['id'],
        };
        if (limit !== undefined) {
            // default 100 max 1000
            request['last'] = limit;
        }
        if (since !== undefined) {
            request['startTime'] = Math.floor(since / 1000);
        }
        const response = await this.privateGetAllOrders(this.extend(request, params));
        // {
        //   "data": [
        //     {
        //       "id": "2606012912",
        //       "price": "55000",
        //       "amount": "0.0003",
        //       "quantity": "0.0003",
        //       "stopPrice": "0",
        //       "pairSymbol": "BTCUSDT",
        //       "pairSymbolNormalized": "BTC_USDT",
        //       "type": "buy",
        //       "method": "limit",
        //       "orderClientId": "2ed187bd-59a8-4875-a212-1b793963b85c",
        //       "time": "1618913189253",
        //       "updateTime": "1618913189253",
        //       "status": "Untouched",
        //       "leftAmount": "0.0003000000000000"
        //     }
        //   ]
        // }
        const data = this.safeList(response, 'data');
        return this.parseOrders(data, market, since, limit);
    }
    parseOrderStatus(status) {
        const statuses = {
            'Untouched': 'open',
            'Partial': 'open',
            'Canceled': 'canceled',
            'Closed': 'closed',
        };
        return this.safeString(statuses, status, status);
    }
    parseOrder(order, market = undefined) {
        //
        // fetchOrders / fetchOpenOrders
        //     {
        //       "id": 2605984008,
        //       "price": "55000",
        //       "amount": "0.00050000",
        //       "quantity": "0.00050000",
        //       "stopPrice": "0",
        //       "pairSymbol": "BTCUSDT",
        //       "pairSymbolNormalized": "BTC_USDT",
        //       "type": "buy",
        //       "method": "limit",
        //       "orderClientId": "f479bdb6-0965-4f03-95b5-daeb7aa5a3a5",
        //       "time": 0,
        //       "updateTime": 1618913083543,
        //       "status": "Untouched",
        //       "leftAmount": "0.00050000"
        //     }
        //
        // createOrder
        //     {
        //       "id": "2606935102",
        //       "quantity": "0.0002",
        //       "price": "56000",
        //       "stopPrice": null,
        //       "newOrderClientId": "98e5c491-7ed9-462b-9666-93553180fb28",
        //       "type": "buy",
        //       "method": "limit",
        //       "pairSymbol": "BTCUSDT",
        //       "pairSymbolNormalized": "BTC_USDT",
        //       "datetime": "1618916479523"
        //     }
        //
        const id = this.safeString(order, 'id');
        const price = this.safeString(order, 'price');
        const amountString = this.safeString2(order, 'amount', 'quantity');
        const amount = Precise["default"].stringAbs(amountString);
        const remaining = this.safeString(order, 'leftAmount');
        const marketId = this.safeString(order, 'pairSymbol');
        const symbol = this.safeSymbol(marketId, market);
        const side = this.safeString(order, 'type');
        const type = this.safeString(order, 'method');
        const clientOrderId = this.safeString(order, 'orderClientId');
        const timestamp = this.safeInteger2(order, 'updateTime', 'datetime');
        const rawStatus = this.safeString(order, 'status');
        const status = this.parseOrderStatus(rawStatus);
        return this.safeOrder({
            'info': order,
            'id': id,
            'price': price,
            'amount': amount,
            'remaining': remaining,
            'filled': undefined,
            'cost': undefined,
            'average': undefined,
            'status': status,
            'side': side,
            'type': type,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'fee': undefined,
        }, market);
    }
    /**
     * @method
     * @name btcturk#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://docs.btcturk.com/private-endpoints/user-transactions
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
        }
        const response = await this.privateGetUsersTransactionsTrade();
        //
        //     {
        //       "data": [
        //         {
        //           "price": "56000",
        //           "numeratorSymbol": "BTC",
        //           "denominatorSymbol": "USDT",
        //           "orderType": "buy",
        //           "orderId": "2606935102",
        //           "id": "320874372",
        //           "timestamp": "1618916479593",
        //           "amount": "0.00020000",
        //           "fee": "0",
        //           "tax": "0"
        //         }
        //       ],
        //       "success": true,
        //       "message": "SUCCESS",
        //       "code": "0"
        //     }
        //
        const data = this.safeList(response, 'data');
        return this.parseTrades(data, market, since, limit);
    }
    nonce() {
        return this.milliseconds();
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        if (this.id === 'btctrader') {
            throw new errors.ExchangeError(this.id + ' is an abstract base API for BTCExchange, BTCTurk');
        }
        let url = this.urls['api'][api] + '/' + path;
        if ((method === 'GET') || (method === 'DELETE')) {
            if (Object.keys(params).length) {
                url += '?' + this.urlencode(params);
            }
        }
        else {
            body = this.json(params);
        }
        if (api === 'private') {
            this.checkRequiredCredentials();
            const nonce = this.nonce().toString();
            const secret = this.base64ToBinary(this.secret);
            const auth = this.apiKey + nonce;
            headers = {
                'X-PCK': this.apiKey,
                'X-Stamp': nonce,
                'X-Signature': this.hmac(this.encode(auth), secret, sha256.sha256, 'base64'),
                'Content-Type': 'application/json',
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    handleErrors(code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        const errorCode = this.safeString(response, 'code', '0');
        const message = this.safeString(response, 'message');
        const output = (message === undefined) ? body : message;
        this.throwExactlyMatchedException(this.exceptions['exact'], message, this.id + ' ' + output);
        if ((errorCode !== '0') && (errorCode !== 'SUCCESS')) {
            throw new errors.ExchangeError(this.id + ' ' + output);
        }
        return undefined;
    }
}

module.exports = btcturk;
