
//  ---------------------------------------------------------------------------

import Exchange from './abstract/mercado.js';
import { ExchangeError, ArgumentsRequired, InvalidOrder } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';
import { sha512 } from './static_dependencies/noble-hashes/sha512.js';
import type { Balances, Currency, Dict, Int, Market, Num, OHLCV, Order, OrderBook, OrderSide, OrderType, Str, Ticker, Trade, Transaction, int } from './base/types.js';
import { Precise } from './base/Precise.js';

//  ---------------------------------------------------------------------------

/**
 * @class mercado
 * @augments Exchange
 */
export default class mercado extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'mercado',
            'name': 'Mercado Bitcoin',
            'countries': [ 'BR' ], // Brazil
            'rateLimit': 1000,
            'version': 'v3',
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
                'createMarketOrder': true,
                'createOrder': true,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'fetchAllGreeks': false,
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
                'fetchMarkPrice': false,
                'fetchMarkPrices': false,
                'fetchMyLiquidations': false,
                'fetchMySettlementHistory': false,
                'fetchMyTrades': 'emulated',
                'fetchOHLCV': true,
                'fetchOpenInterest': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenInterests': false,
                'fetchOpenOrders': true,
                'fetchOption': false,
                'fetchOptionChain': false,
                'fetchOrder': true,
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
                'fetchTickers': false,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchUnderlyingAssets': false,
                'fetchVolatilityHistory': false,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'withdraw': true,
            },
            'timeframes': {
                '15m': '15m',
                '1h': '1h',
                '3h': '3h',
                '1d': '1d',
                '1w': '1w',
                '1M': '1M',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27837060-e7c58714-60ea-11e7-9192-f05e86adb83f.jpg',
                'api': {
                    'public': 'https://www.mercadobitcoin.net/api',
                    'private': 'https://www.mercadobitcoin.net/tapi',
                    'v4Public': 'https://www.mercadobitcoin.com.br/v4',
                    'v4PublicNet': 'https://api.mercadobitcoin.net/api/v4',
                },
                'www': 'https://www.mercadobitcoin.com.br',
                'doc': [
                    'https://www.mercadobitcoin.com.br/api-doc',
                    'https://www.mercadobitcoin.com.br/trade-api',
                ],
            },
            'api': {
                'public': {
                    'get': [
                        'coins',
                        '{coin}/orderbook/', // last slash critical
                        '{coin}/ticker/',
                        '{coin}/trades/',
                        '{coin}/trades/{from}/',
                        '{coin}/trades/{from}/{to}',
                        '{coin}/day-summary/{year}/{month}/{day}/',
                    ],
                },
                'private': {
                    'post': [
                        'cancel_order',
                        'get_account_info',
                        'get_order',
                        'get_withdrawal',
                        'list_system_messages',
                        'list_orders',
                        'list_orderbook',
                        'place_buy_order',
                        'place_sell_order',
                        'place_market_buy_order',
                        'place_market_sell_order',
                        'withdraw_coin',
                    ],
                },
                'v4Public': {
                    'get': [
                        '{coin}/candle/',
                    ],
                },
                'v4PublicNet': {
                    'get': [
                        'candles',
                    ],
                },
            },
            'fees': {
                'trading': {
                    'maker': 0.003,
                    'taker': 0.007,
                },
            },
            'options': {
                'limits': {
                    'BTC': 0.001,
                    'BCH': 0.001,
                    'ETH': 0.01,
                    'LTC': 0.01,
                    'XRP': 0.1,
                },
            },
            'features': {
                'spot': {
                    'sandbox': false,
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': false,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false,
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        'timeInForce': {
                            'IOC': false,
                            'FOK': false,
                            'PO': true, // todo
                            'GTD': false,
                        },
                        'hedged': false,
                        'trailing': false,
                        'leverage': false,
                        'marketBuyByCost': true, // todo
                        'marketBuyRequiresPrice': true,
                        'selfTradePrevention': false,
                        'iceberg': false,
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': undefined, // todo
                        'daysBack': 100000, // todo
                        'untilDays': 100000, // todo
                        'symbolRequired': true,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': undefined,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchOrders': {
                        'marginMode': false,
                        'limit': 500,
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchClosedOrders': undefined,
                    'fetchOHLCV': {
                        'limit': 1000,
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
            'precisionMode': TICK_SIZE,
        });
    }

    /**
     * @method
     * @name mercado#fetchMarkets
     * @description retrieves data on all markets for mercado
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        const response = await this.publicGetCoins (params);
        //
        //     [
        //         "BCH",
        //         "BTC",
        //         "ETH",
        //         "LTC",
        //         "XRP",
        //         "MBPRK01",
        //         "MBPRK02",
        //         "MBPRK03",
        //         "MBPRK04",
        //         "MBCONS01",
        //         "USDC",
        //         "WBX",
        //         "CHZ",
        //         "MBCONS02",
        //         "PAXG",
        //         "MBVASCO01",
        //         "LINK"
        //     ]
        //
        const result = [];
        const amountLimits = this.safeValue (this.options, 'limits', {});
        for (let i = 0; i < response.length; i++) {
            const coin = response[i];
            const baseId = coin;
            const quoteId = 'BRL';
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const id = quote + base;
            result.push ({
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
                'active': undefined,
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.parseNumber ('1e-8'),
                    'price': this.parseNumber ('1e-5'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': this.safeNumber (amountLimits, baseId),
                        'max': undefined,
                    },
                    'price': {
                        'min': this.parseNumber ('1e-5'),
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': coin,
            });
        }
        return result;
    }

    /**
     * @method
     * @name mercado#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'coin': market['base'],
        };
        const response = await this.publicGetCoinOrderbook (this.extend (request, params));
        return this.parseOrderBook (response, market['symbol']);
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        //
        //     {
        //         "high":"103.96000000",
        //         "low":"95.00000000",
        //         "vol":"2227.67806598",
        //         "last":"97.91591000",
        //         "buy":"95.52760000",
        //         "sell":"97.91475000",
        //         "open":"99.79955000",
        //         "date":1643382606
        //     }
        //
        const symbol = this.safeSymbol (undefined, market);
        const timestamp = this.safeTimestamp (ticker, 'date');
        const last = this.safeString (ticker, 'last');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'high'),
            'low': this.safeString (ticker, 'low'),
            'bid': this.safeString (ticker, 'buy'),
            'bidVolume': undefined,
            'ask': this.safeString (ticker, 'sell'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'vol'),
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }

    /**
     * @method
     * @name mercado#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'coin': market['base'],
        };
        const response = await this.publicGetCoinTicker (this.extend (request, params));
        const ticker = this.safeValue (response, 'ticker', {});
        //
        //     {
        //         "ticker": {
        //             "high":"1549.82293000",
        //             "low":"1503.00011000",
        //             "vol":"81.82827101",
        //             "last":"1533.15000000",
        //             "buy":"1533.21018000",
        //             "sell":"1540.09000000",
        //             "open":"1524.71089000",
        //             "date":1643691671
        //         }
        //     }
        //
        return this.parseTicker (ticker, market);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        const timestamp = this.safeTimestamp2 (trade, 'date', 'executed_timestamp');
        market = this.safeMarket (undefined, market);
        const id = this.safeString2 (trade, 'tid', 'operation_id');
        const type = undefined;
        const side = this.safeString (trade, 'type');
        const price = this.safeString (trade, 'price');
        const amount = this.safeString2 (trade, 'amount', 'quantity');
        const feeCost = this.safeString (trade, 'fee_rate');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = {
                'cost': feeCost,
                'currency': undefined,
            };
        }
        return this.safeTrade ({
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'order': undefined,
            'type': type,
            'side': side,
            'takerOrMaker': undefined,
            'price': price,
            'amount': amount,
            'cost': undefined,
            'fee': fee,
        }, market);
    }

    /**
     * @method
     * @name mercado#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let method = 'publicGetCoinTrades';
        const request: Dict = {
            'coin': market['base'],
        };
        if (since !== undefined) {
            method += 'From';
            request['from'] = this.parseToInt (since / 1000);
        }
        const to = this.safeInteger (params, 'to');
        if (to !== undefined) {
            method += 'To';
        }
        const response = await this[method] (this.extend (request, params));
        return this.parseTrades (response, market, since, limit);
    }

    parseBalance (response): Balances {
        const data = this.safeValue (response, 'response_data', {});
        const balances = this.safeValue (data, 'balance', {});
        const result: Dict = { 'info': response };
        const currencyIds = Object.keys (balances);
        for (let i = 0; i < currencyIds.length; i++) {
            const currencyId = currencyIds[i];
            const code = this.safeCurrencyCode (currencyId);
            if (currencyId in balances) {
                const balance = this.safeValue (balances, currencyId, {});
                const account = this.account ();
                account['free'] = this.safeString (balance, 'available');
                account['total'] = this.safeString (balance, 'total');
                result[code] = account;
            }
        }
        return this.safeBalance (result);
    }

    /**
     * @method
     * @name mercado#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance (params = {}): Promise<Balances> {
        await this.loadMarkets ();
        const response = await this.privatePostGetAccountInfo (params);
        return this.parseBalance (response);
    }

    /**
     * @method
     * @name mercado#createOrder
     * @description create a trade order
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'coin_pair': market['id'],
        };
        let method = this.capitalize (side) + 'Order';
        if (type === 'limit') {
            method = 'privatePostPlace' + method;
            request['limit_price'] = this.priceToPrecision (market['symbol'], price);
            request['quantity'] = this.amountToPrecision (market['symbol'], amount);
        } else {
            method = 'privatePostPlaceMarket' + method;
            if (side === 'buy') {
                if (price === undefined) {
                    throw new InvalidOrder (this.id + ' createOrder() requires the price argument with market buy orders to calculate total order cost (amount to spend), where cost = amount * price. Supply a price argument to createOrder() call if you want the cost to be calculated for you from price and amount');
                }
                const amountString = this.numberToString (amount);
                const priceString = this.numberToString (price);
                const cost = this.parseToNumeric (Precise.stringMul (amountString, priceString));
                request['cost'] = this.priceToPrecision (market['symbol'], cost);
            } else {
                request['quantity'] = this.amountToPrecision (market['symbol'], amount);
            }
        }
        const response = await this[method] (this.extend (request, params));
        // TODO: replace this with a call to parseOrder for unification
        return this.safeOrder ({
            'info': response,
            'id': response['response_data']['order']['order_id'].toString (),
        }, market);
    }

    /**
     * @method
     * @name mercado#cancelOrder
     * @description cancels an open order
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'coin_pair': market['id'],
            'order_id': id,
        };
        const response = await this.privatePostCancelOrder (this.extend (request, params));
        //
        //     {
        //         "response_data": {
        //             "order": {
        //                 "order_id": 2176769,
        //                 "coin_pair": "BRLBCH",
        //                 "order_type": 2,
        //                 "status": 3,
        //                 "has_fills": false,
        //                 "quantity": "0.10000000",
        //                 "limit_price": "1996.15999",
        //                 "executed_quantity": "0.00000000",
        //                 "executed_price_avg": "0.00000",
        //                 "fee": "0.00000000",
        //                 "created_timestamp": "1536956488",
        //                 "updated_timestamp": "1536956499",
        //                 "operations": []
        //             }
        //         },
        //         "status_code": 100,
        //         "server_unix_timestamp": "1536956499"
        //     }
        //
        const responseData = this.safeValue (response, 'response_data', {});
        const order = this.safeDict (responseData, 'order', {});
        return this.parseOrder (order, market);
    }

    parseOrderStatus (status: Str) {
        const statuses: Dict = {
            '2': 'open',
            '3': 'canceled',
            '4': 'closed',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        //
        //     {
        //         "order_id": 4,
        //         "coin_pair": "BRLBTC",
        //         "order_type": 1,
        //         "status": 2,
        //         "has_fills": true,
        //         "quantity": "2.00000000",
        //         "limit_price": "900.00000",
        //         "executed_quantity": "1.00000000",
        //         "executed_price_avg": "900.00000",
        //         "fee": "0.00300000",
        //         "created_timestamp": "1453838494",
        //         "updated_timestamp": "1453838494",
        //         "operations": [
        //             {
        //                 "operation_id": 1,
        //                 "quantity": "1.00000000",
        //                 "price": "900.00000",
        //                 "fee_rate": "0.30",
        //                 "executed_timestamp": "1453838494",
        //             },
        //         ],
        //     }
        //
        const id = this.safeString (order, 'order_id');
        const order_type = this.safeString (order, 'order_type');
        let side = undefined;
        if ('order_type' in order) {
            side = (order_type === '1') ? 'buy' : 'sell';
        }
        const status = this.parseOrderStatus (this.safeString (order, 'status'));
        const marketId = this.safeString (order, 'coin_pair');
        market = this.safeMarket (marketId, market);
        const timestamp = this.safeTimestamp (order, 'created_timestamp');
        const fee = {
            'cost': this.safeString (order, 'fee'),
            'currency': market['quote'],
        };
        const price = this.safeString (order, 'limit_price');
        // price = this.safeNumber (order, 'executed_price_avg', price);
        const average = this.safeString (order, 'executed_price_avg');
        const amount = this.safeString (order, 'quantity');
        const filled = this.safeString (order, 'executed_quantity');
        const lastTradeTimestamp = this.safeTimestamp (order, 'updated_timestamp');
        const rawTrades = this.safeValue (order, 'operations', []);
        return this.safeOrder ({
            'info': order,
            'id': id,
            'clientOrderId': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'symbol': market['symbol'],
            'type': 'limit',
            'timeInForce': undefined,
            'postOnly': undefined,
            'side': side,
            'price': price,
            'triggerPrice': undefined,
            'cost': undefined,
            'average': average,
            'amount': amount,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': fee,
            'trades': rawTrades,
        }, market);
    }

    /**
     * @method
     * @name mercado#fetchOrder
     * @description fetches information on an order made by the user
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrder (id: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'coin_pair': market['id'],
            'order_id': parseInt (id),
        };
        const response = await this.privatePostGetOrder (this.extend (request, params));
        const responseData = this.safeValue (response, 'response_data', {});
        const order = this.safeDict (responseData, 'order');
        return this.parseOrder (order, market);
    }

    /**
     * @method
     * @name mercado#withdraw
     * @description make a withdrawal
     * @param {string} code unified currency code
     * @param {float} amount the amount to withdraw
     * @param {string} address the address to withdraw to
     * @param {string} tag
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async withdraw (code: string, amount: number, address: string, tag = undefined, params = {}): Promise<Transaction> {
        [ tag, params ] = this.handleWithdrawTagAndParams (tag, params);
        this.checkAddress (address);
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'coin': currency['id'],
            'quantity': amount.toFixed (10),
            'address': address,
        };
        if (code === 'BRL') {
            const account_ref = ('account_ref' in params);
            if (!account_ref) {
                throw new ArgumentsRequired (this.id + ' withdraw() requires account_ref parameter to withdraw ' + code);
            }
        } else if (code !== 'LTC') {
            const tx_fee = ('tx_fee' in params);
            if (!tx_fee) {
                throw new ArgumentsRequired (this.id + ' withdraw() requires tx_fee parameter to withdraw ' + code);
            }
            if (code === 'XRP') {
                if (tag === undefined) {
                    if (!('destination_tag' in params)) {
                        throw new ArgumentsRequired (this.id + ' withdraw() requires a tag argument or destination_tag parameter to withdraw ' + code);
                    }
                } else {
                    request['destination_tag'] = tag;
                }
            }
        }
        const response = await this.privatePostWithdrawCoin (this.extend (request, params));
        //
        //     {
        //         "response_data": {
        //             "withdrawal": {
        //                 "id": 1,
        //                 "coin": "BRL",
        //                 "quantity": "300.56",
        //                 "net_quantity": "291.68",
        //                 "fee": "8.88",
        //                 "account": "bco: 341, ag: 1111, cta: 23456-X",
        //                 "status": 1,
        //                 "created_timestamp": "1453912088",
        //                 "updated_timestamp": "1453912088"
        //             }
        //         },
        //         "status_code": 100,
        //         "server_unix_timestamp": "1453912088"
        //     }
        //
        const responseData = this.safeValue (response, 'response_data', {});
        const withdrawal = this.safeDict (responseData, 'withdrawal');
        return this.parseTransaction (withdrawal, currency);
    }

    parseTransaction (transaction: Dict, currency: Currency = undefined): Transaction {
        //
        //     {
        //         "id": 1,
        //         "coin": "BRL",
        //         "quantity": "300.56",
        //         "net_quantity": "291.68",
        //         "fee": "8.88",
        //         "account": "bco: 341, ag: 1111, cta: 23456-X",
        //         "status": 1,
        //         "created_timestamp": "1453912088",
        //         "updated_timestamp": "1453912088"
        //     }
        //
        currency = this.safeCurrency (undefined, currency);
        return {
            'id': this.safeString (transaction, 'id'),
            'txid': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'network': undefined,
            'addressFrom': undefined,
            'address': undefined,
            'addressTo': undefined,
            'amount': undefined,
            'type': undefined,
            'currency': currency['code'],
            'status': undefined,
            'updated': undefined,
            'tagFrom': undefined,
            'tag': undefined,
            'tagTo': undefined,
            'comment': undefined,
            'internal': undefined,
            'fee': undefined,
            'info': transaction,
        } as Transaction;
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        return [
            this.safeInteger (ohlcv, 0),
            this.safeNumber (ohlcv, 1),
            this.safeNumber (ohlcv, 2),
            this.safeNumber (ohlcv, 3),
            this.safeNumber (ohlcv, 4),
            this.safeNumber (ohlcv, 5),
        ];
    }

    /**
     * @method
     * @name mercado#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV (symbol: string, timeframe = '15m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'resolution': this.safeString (this.timeframes, timeframe, timeframe),
            'symbol': market['base'] + '-' + market['quote'], // exceptional endpoint, that needs custom symbol syntax
        };
        if (limit === undefined) {
            limit = 100; // set some default limit, as it's required if user doesn't provide it
        }
        if (since !== undefined) {
            request['from'] = this.parseToInt (since / 1000);
            request['to'] = this.sum (request['from'], limit * this.parseTimeframe (timeframe));
        } else {
            request['to'] = this.seconds ();
            request['from'] = request['to'] - (limit * this.parseTimeframe (timeframe));
        }
        const response = await this.v4PublicNetGetCandles (this.extend (request, params));
        const candles = this.convertTradingViewToOHLCV (response, 't', 'o', 'h', 'l', 'c', 'v');
        return this.parseOHLCVs (candles, market, timeframe, since, limit);
    }

    /**
     * @method
     * @name mercado#fetchOrders
     * @description fetches information on multiple orders made by the user
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'coin_pair': market['id'],
        };
        const response = await this.privatePostListOrders (this.extend (request, params));
        const responseData = this.safeValue (response, 'response_data', {});
        const orders = this.safeList (responseData, 'orders', []);
        return this.parseOrders (orders, market, since, limit);
    }

    /**
     * @method
     * @name mercado#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of open order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOpenOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'coin_pair': market['id'],
            'status_list': '[2]', // open only
        };
        const response = await this.privatePostListOrders (this.extend (request, params));
        const responseData = this.safeValue (response, 'response_data', {});
        const orders = this.safeList (responseData, 'orders', []);
        return this.parseOrders (orders, market, since, limit);
    }

    /**
     * @method
     * @name mercado#fetchMyTrades
     * @description fetch all trades made by the user
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchMyTrades() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'coin_pair': market['id'],
            'has_fills': true,
        };
        const response = await this.privatePostListOrders (this.extend (request, params));
        const responseData = this.safeValue (response, 'response_data', {});
        const ordersRaw = this.safeValue (responseData, 'orders', []);
        const orders = this.parseOrders (ordersRaw, market, since, limit);
        const trades = this.ordersToTrades (orders);
        return this.filterBySymbolSinceLimit (trades, market['symbol'], since, limit) as Trade[];
    }

    ordersToTrades (orders) {
        const result = [];
        for (let i = 0; i < orders.length; i++) {
            const trades = this.safeValue (orders[i], 'trades', []);
            for (let y = 0; y < trades.length; y++) {
                result.push (trades[y]);
            }
        }
        return result;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/';
        const query = this.omit (params, this.extractParams (path));
        if ((api === 'public') || (api === 'v4Public') || (api === 'v4PublicNet')) {
            url += this.implodeParams (path, params);
            if (Object.keys (query).length) {
                url += '?' + this.urlencode (query);
            }
        } else {
            this.checkRequiredCredentials ();
            url += this.version + '/';
            const nonce = this.nonce ();
            body = this.urlencode (this.extend ({
                'tapi_method': path,
                'tapi_nonce': nonce,
            }, params));
            const auth = '/tapi/' + this.version + '/' + '?' + body;
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'TAPI-ID': this.apiKey,
                'TAPI-MAC': this.hmac (this.encode (auth), this.encode (this.secret), sha512),
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode: int, reason: string, url: string, method: string, headers: Dict, body: string, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined;
        }
        //
        // todo add a unified standard handleErrors with this.exceptions in describe()
        //
        //     {"status":503,"message":"Maintenancing, try again later","result":null}
        //
        const errorMessage = this.safeValue (response, 'error_message');
        if (errorMessage !== undefined) {
            throw new ExchangeError (this.id + ' ' + this.json (response));
        }
        return undefined;
    }
}
