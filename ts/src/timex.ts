import Exchange from './abstract/timex.js';
import { ExchangeError, PermissionDenied, ExchangeNotAvailable, InsufficientFunds, OrderNotFound, InvalidOrder, RateLimitExceeded, NotSupported, BadRequest, AuthenticationError, ArgumentsRequired } from './base/errors.js';
import { Precise } from './base/Precise.js';
import { TICK_SIZE } from './base/functions/number.js';
import type { Balances, Currencies, Currency, Dict, Int, Market, Num, OHLCV, Order, OrderBook, OrderSide, OrderType, Str, Strings, Ticker, Tickers, Trade, TradingFeeInterface, Transaction, int, DepositAddress } from './base/types.js';

/**
 * @class timex
 * @augments Exchange
 */
export default class timex extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'timex',
            'name': 'TimeX',
            'countries': [ 'AU' ],
            'version': 'v1',
            'rateLimit': 1500,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'cancelOrder': true,
                'cancelOrders': true,
                'createOrder': true,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'editOrder': true,
                'fetchBalance': true,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchClosedOrders': true,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDeposit': false,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': true,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLeverage': false,
                'fetchLeverageTiers': false,
                'fetchMarginMode': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsForSymbol': false,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true, // maker fee only
                'fetchWithdrawal': false,
                'fetchWithdrawals': true,
                'reduceMargin': false,
                'setLeverage': false,
                'setMarginMode': false,
                'setPositionMode': false,
            },
            'timeframes': {
                '1m': 'I1',
                '5m': 'I5',
                '15m': 'I15',
                '30m': 'I30',
                '1h': 'H1',
                '2h': 'H2',
                '4h': 'H4',
                '6h': 'H6',
                '12h': 'H12',
                '1d': 'D1',
                '1w': 'W1',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/70423869-6839ab00-1a7f-11ea-8f94-13ae72c31115.jpg',
                'api': {
                    'rest': 'https://plasma-relay-backend.timex.io',
                },
                'www': 'https://timex.io',
                'doc': 'https://plasma-relay-backend.timex.io/swagger-ui/index.html',
                'referral': 'https://timex.io/?refcode=1x27vNkTbP1uwkCck',
            },
            'api': {
                'addressbook': {
                    'get': [
                        'me',
                    ],
                    'post': [
                        '',
                        'id/{id}',
                        'id/{id}/remove',
                    ],
                },
                'custody': {
                    'get': [
                        'credentials', // Get api key for address
                        'credentials/h/{hash}', // Get api key by hash
                        'credentials/k/{key}', // Get api key by key
                        'credentials/me',
                        'credentials/me/address', // Get api key by hash
                        'deposit-addresses', // Get deposit addresses list
                        'deposit-addresses/h/{hash}', // Get deposit address by hash
                    ],
                },
                'history': {
                    'get': [
                        'orders', // Gets historical orders
                        'orders/details', // Gets order details
                        'orders/export/csv', // Export orders to csv
                        'trades', // Gets historical trades
                        'trades/export/csv', // Export trades to csv
                    ],
                },
                'currencies': {
                    'get': [
                        'a/{address}', // Gets currency by address
                        'i/{id}', // Gets currency by id
                        's/{symbol}', // Gets currency by symbol
                    ],
                    'post': [
                        'perform', // Creates new currency
                        'prepare', // Prepare creates new currency
                        'remove/perform', // Removes currency by symbol
                        's/{symbol}/remove/prepare', // Prepare remove currency by symbol
                        's/{symbol}/update/perform', // Prepare update currency by symbol
                        's/{symbol}/update/prepare', // Prepare update currency by symbol
                    ],
                },
                'manager': {
                    'get': [
                        'deposits',
                        'transfers',
                        'withdrawals',
                    ],
                },
                'markets': {
                    'get': [
                        'i/{id}', // Gets market by id
                        's/{symbol}', // Gets market by symbol
                    ],
                    'post': [
                        'perform', // Creates new market
                        'prepare', // Prepare creates new market
                        'remove/perform', // Removes market by symbol
                        's/{symbol}/remove/prepare', // Prepare remove market by symbol
                        's/{symbol}/update/perform', // Prepare update market by symbol
                        's/{symbol}/update/prepare', // Prepare update market by symbol
                    ],
                },
                'public': {
                    'get': [
                        'candles', // Gets candles
                        'currencies', // Gets all the currencies
                        'markets', // Gets all the markets
                        'orderbook', // Gets orderbook
                        'orderbook/raw', // Gets raw orderbook
                        'orderbook/v2', // Gets orderbook v2
                        'tickers', // Gets all the tickers
                        'trades', // Gets trades
                    ],
                },
                'statistics': {
                    'get': [
                        'address', // calculateAddressStatistics
                    ],
                },
                'trading': {
                    'get': [
                        'balances', // Get trading balances for all (or selected) currencies
                        'fees', // Get trading fee rates for all (or selected) markets
                        'orders', // Gets open orders
                    ],
                    'post': [
                        'orders', // Create new order
                        'orders/json', // Create orders
                    ],
                    'put': [
                        'orders', // Cancel or update orders
                        'orders/json', // Update orders
                    ],
                    'delete': [
                        'orders', // Delete orders
                        'orders/json', // Delete orders
                    ],
                },
                'tradingview': {
                    'get': [
                        'config', // Gets config
                        'history', // Gets history
                        'symbol_info', // Gets symbol info
                        'time', // Gets time
                    ],
                },
            },
            'precisionMode': TICK_SIZE,
            'exceptions': {
                'exact': {
                    '0': ExchangeError,
                    '1': NotSupported,
                    '4000': BadRequest,
                    '4001': BadRequest,
                    '4002': InsufficientFunds,
                    '4003': AuthenticationError,
                    '4004': AuthenticationError,
                    '4005': BadRequest,
                    '4006': BadRequest,
                    '4007': BadRequest,
                    '4300': PermissionDenied,
                    '4100': AuthenticationError,
                    '4400': OrderNotFound,
                    '5001': InvalidOrder,
                    '5002': ExchangeError,
                    '400': BadRequest,
                    '401': AuthenticationError,
                    '403': PermissionDenied,
                    '404': OrderNotFound,
                    '429': RateLimitExceeded,
                    '500': ExchangeError,
                    '503': ExchangeNotAvailable,
                },
                'broad': {
                    'Insufficient': InsufficientFunds,
                },
            },
            'options': {
                'expireIn': 31536000, // 365 × 24 × 60 × 60
                'fetchTickers': {
                    'period': '1d',
                },
                'fetchTrades': {
                    'sort': 'timestamp,asc',
                },
                'fetchMyTrades': {
                    'sort': 'timestamp,asc',
                },
                'fetchOpenOrders': {
                    'sort': 'createdAt,asc',
                },
                'fetchClosedOrders': {
                    'sort': 'createdAt,asc',
                },
                'defaultSort': 'timestamp,asc',
                'defaultSortOrders': 'createdAt,asc',
            },
            'features': {
                'spot': {
                    'sandbox': false,
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': false,
                        'triggerDirection': false,
                        'triggerPriceType': undefined,
                        'stopLossPrice': false,
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        // todo
                        'timeInForce': {
                            'IOC': true,
                            'FOK': true,
                            'PO': false,
                            'GTD': true,
                        },
                        'hedged': false,
                        'trailing': false,
                        'leverage': false,
                        'marketBuyByCost': false,
                        'marketBuyRequiresPrice': false,
                        'selfTradePrevention': false,
                        'iceberg': false,
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 100, // todo
                        'daysBack': 100000, // todo
                        'untilDays': 100000, // todo
                        'symbolRequired': false,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': 100, // todo
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOrders': undefined, // todo
                    'fetchClosedOrders': {
                        'marginMode': false,
                        'limit': 100, // todo
                        'daysBack': 100000, // todo
                        'daysBackCanceled': 1, // todo
                        'untilDays': 100000, // todo
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
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
        });
    }

    /**
     * @method
     * @name timex#fetchTime
     * @description fetches the current integer timestamp in milliseconds from the exchange server
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {int} the current integer timestamp in milliseconds from the exchange server
     */
    async fetchTime (params = {}): Promise<Int> {
        const response = await this.tradingviewGetTime (params);
        //
        //     1708682617
        //
        return this.parseToInt (response) * 1000;
    }

    /**
     * @method
     * @name timex#fetchMarkets
     * @description retrieves data on all markets for timex
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Public/listMarkets
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        const response = await this.publicGetMarkets (params);
        //
        //     [
        //         {
        //             "symbol": "ETHBTC",
        //             "name": "ETH/BTC",
        //             "baseCurrency": "ETH",
        //             "baseTokenAddress": "0x45932db54b38af1f5a57136302eeba66a5975c15",
        //             "quoteCurrency": "BTC",
        //             "quoteTokenAddress": "0x8370fbc6ddec1e18b4e41e72ed943e238458487c",
        //             "feeCurrency": "BTC",
        //             "feeTokenAddress": "0x8370fbc6ddec1e18b4e41e72ed943e238458487c",
        //             "quantityIncrement": "0.0000001",
        //             "takerFee": "0.005",
        //             "makerFee": "0.0025",
        //             "tickSize": "0.00000001",
        //             "baseMinSize": "0.0001",
        //             "quoteMinSize": "0.00001",
        //             "locked": false
        //         }
        //     ]
        //
        return this.parseMarkets (response);
    }

    /**
     * @method
     * @name timex#fetchCurrencies
     * @description fetches all available currencies on an exchange
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Public/listCurrencies
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an associative dictionary of currencies
     */
    async fetchCurrencies (params = {}): Promise<Currencies> {
        const response = await this.publicGetCurrencies (params);
        //
        //     [
        //         {
        //             "symbol": "BTC",
        //             "name": "Bitcoin",
        //             "address": "0x8370fbc6ddec1e18b4e41e72ed943e238458487c",
        //             "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggb3BhY2l0eT0iMC41IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwIDUzQzQyLjcwMjUgNTMgNTMgNDIuNzAyNSA1MyAzMEM1MyAxNy4yOTc1IDQyLjcwMjUgNyAzMCA3QzE3LjI5NzUgNyA3IDE3LjI5NzUgNyAzMEM3IDQyLjcwMjUgMTcuMjk3NSA1MyAzMCA1M1pNMzAgNTVDNDMuODA3MSA1NSA1NSA0My44MDcxIDU1IDMwQzU1IDE2LjE5MjkgNDMuODA3MSA1IDMwIDVDMTYuMTkyOSA1IDUgMTYuMTkyOSA1IDMwQzUgNDMuODA3MSAxNi4xOTI5IDU1IDMwIDU1WiIvPgo8cGF0aCBkPSJNNDAuOTQyNSAyNi42NTg1QzQxLjQwMDMgMjMuNjExMyAzOS4wNzA1IDIxLjk3MzIgMzUuODg0OCAyMC44ODA0TDM2LjkxODIgMTYuNzUyNkwzNC4zOTUxIDE2LjEyNjRMMzMuMzg5IDIwLjE0NTVDMzIuNzI1OCAxOS45ODA5IDMyLjA0NDUgMTkuODI1NiAzMS4zNjc1IDE5LjY3MTdMMzIuMzgwOCAxNS42MjYyTDI5Ljg1OTEgMTVMMjguODI1IDE5LjEyNjRDMjguMjc2IDE5LjAwMTkgMjcuNzM3IDE4Ljg3ODggMjcuMjEzOSAxOC43NDkzTDI3LjIxNjggMTguNzM2NEwyMy43MzcyIDE3Ljg3MTJMMjMuMDY2IDIwLjU1NDhDMjMuMDY2IDIwLjU1NDggMjQuOTM4IDIwLjk4MjEgMjQuODk4NSAyMS4wMDg1QzI1LjkyMDQgMjEuMjYyNiAyNi4xMDUgMjEuOTM2IDI2LjA3NDEgMjIuNDY5OUwyNC44OTcgMjcuMTcyNEMyNC45Njc1IDI3LjE5MDMgMjUuMDU4NyAyNy4yMTYgMjUuMTU5MyAyNy4yNTYxQzI1LjA3NTMgMjcuMjM1NCAyNC45ODU0IDI3LjIxMjQgMjQuODkyNyAyNy4xOTAzTDIzLjI0MjggMzMuNzc3OEMyMy4xMTc3IDM0LjA4NjkgMjIuODAwOCAzNC41NTA2IDIyLjA4NjUgMzQuMzc0NkMyMi4xMTE3IDM0LjQxMTEgMjAuMjUyNiAzMy45MTg3IDIwLjI1MjYgMzMuOTE4N0wxOSAzNi43OTQ5TDIyLjI4MzQgMzcuNjFDMjIuODk0MiAzNy43NjI0IDIzLjQ5MjggMzcuOTIyIDI0LjA4MjEgMzguMDcyM0wyMy4wMzggNDIuMjQ3NEwyNS41NTgyIDQyLjg3MzZMMjYuNTkyMyAzOC43NDI5QzI3LjI4MDcgMzguOTI5IDI3Ljk0OSAzOS4xMDA3IDI4LjYwMyAzOS4yNjI0TDI3LjU3MjUgNDMuMzczOEwzMC4wOTU2IDQ0TDMxLjEzOTcgMzkuODMyOEMzNS40NDIyIDQwLjY0MzYgMzguNjc3NCA0MC4zMTY2IDQwLjAzOTIgMzYuNDQxNEM0MS4xMzY1IDMzLjMyMTIgMzkuOTg0NiAzMS41MjEzIDM3LjcyMDkgMzAuMzQ3N0MzOS4zNjk0IDI5Ljk2OTEgNDAuNjExMiAyOC44ODkyIDQwLjk0MjUgMjYuNjU4NVYyNi42NTg1Wk0zNS4xNzc3IDM0LjcwODhDMzQuMzk4IDM3LjgyOSAyOS4xMjI2IDM2LjE0MjIgMjcuNDEyMiAzNS43MTkzTDI4Ljc5NzcgMzAuMTg4MUMzMC41MDgxIDMwLjYxMzIgMzUuOTkyNiAzMS40NTQ4IDM1LjE3NzcgMzQuNzA4OFpNMzUuOTU4MSAyNi42MTM0QzM1LjI0NjcgMjkuNDUxNyAzMC44NTU5IDI4LjAwOTcgMjkuNDMxNiAyNy42NTYxTDMwLjY4NzcgMjIuNjM5NUMzMi4xMTIgMjIuOTkzIDM2LjY5OSAyMy42NTI4IDM1Ljk1ODEgMjYuNjEzNFoiLz4KPC9zdmc+Cg==",
        //             "background": "transparent",
        //             "fiatSymbol": "BTC",
        //             "decimals": 8,
        //             "tradeDecimals": 20,
        //             "displayDecimals": 4,
        //             "crypto": true,
        //             "depositEnabled": true,
        //             "withdrawalEnabled": true,
        //             "transferEnabled": true,
        //             "buyEnabled": false,
        //             "purchaseEnabled": false,
        //             "redeemEnabled": false,
        //             "active": true,
        //             "withdrawalFee": "50000000000000000",
        //             "purchaseCommissions": []
        //         },
        //     ]
        //
        return this.parseCurrencies (response);
    }

    /**
     * @method
     * @name timex#fetchDeposits
     * @description fetch all deposits made to an account
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Manager/getDeposits
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch deposits for
     * @param {int} [limit] the maximum number of deposits structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDeposits (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        const address = this.safeString (params, 'address');
        params = this.omit (params, 'address');
        if (address === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchDeposits() requires an address parameter');
        }
        const request: Dict = {
            'address': address,
        };
        const response = await this.managerGetDeposits (this.extend (request, params));
        //
        //     [
        //         {
        //             "from": "0x1134cc86b45039cc211c6d1d2e4b3c77f60207ed",
        //             "timestamp": "2022-01-01T00:00:00Z",
        //             "to": "0x1134cc86b45039cc211c6d1d2e4b3c77f60207ed",
        //             "token": "0x6baad3fe5d0fd4be604420e728adbd68d67e119e",
        //             "transferHash": "0x5464cdff35448314e178b8677ea41e670ea0f2533f4e52bfbd4e4a6cfcdef4c2",
        //             "value": "100"
        //         }
        //     ]
        //
        const currency = this.safeCurrency (code);
        return this.parseTransactions (response, currency, since, limit);
    }

    /**
     * @method
     * @name timex#fetchWithdrawals
     * @description fetch all withdrawals made to an account
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Manager/getWithdraws
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch withdrawals for
     * @param {int} [limit] the maximum number of transaction structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchWithdrawals (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        const address = this.safeString (params, 'address');
        params = this.omit (params, 'address');
        if (address === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchDeposits() requires an address parameter');
        }
        const request: Dict = {
            'address': address,
        };
        const response = await this.managerGetWithdrawals (this.extend (request, params));
        //
        //     [
        //         {
        //             "from": "0x1134cc86b45039cc211c6d1d2e4b3c77f60207ed",
        //             "timestamp": "2022-01-01T00:00:00Z",
        //             "to": "0x1134cc86b45039cc211c6d1d2e4b3c77f60207ed",
        //             "token": "0x6baad3fe5d0fd4be604420e728adbd68d67e119e",
        //             "transferHash": "0x5464cdff35448314e178b8677ea41e670ea0f2533f4e52bfbd4e4a6cfcdef4c2",
        //             "value": "100"
        //         }
        //     ]
        //
        const currency = this.safeCurrency (code);
        return this.parseTransactions (response, currency, since, limit);
    }

    getCurrencyByAddress (address) {
        const currencies = this.currencies as any;
        for (let i = 0; i < currencies.length; i++) {
            const currency = currencies[i];
            const info = this.safeValue (currency, 'info', {});
            const a = this.safeString (info, 'address');
            if (a === address) {
                return currency;
            }
        }
        return undefined;
    }

    parseTransaction (transaction: Dict, currency: Currency = undefined): Transaction {
        //
        //     {
        //         "from": "0x1134cc86b45039cc211c6d1d2e4b3c77f60207ed",
        //         "timestamp": "2022-01-01T00:00:00Z",
        //         "to": "0x1134cc86b45039cc211c6d1d2e4b3c77f60207ed",
        //         "token": "0x6baad3fe5d0fd4be604420e728adbd68d67e119e",
        //         "transferHash": "0x5464cdff35448314e178b8677ea41e670ea0f2533f4e52bfbd4e4a6cfcdef4c2",
        //         "value": "100"
        //     }
        //
        const datetime = this.safeString (transaction, 'timestamp');
        const currencyAddresss = this.safeString (transaction, 'token', '');
        currency = this.getCurrencyByAddress (currencyAddresss);
        return {
            'info': transaction,
            'id': this.safeString (transaction, 'transferHash'),
            'txid': this.safeString (transaction, 'txid'),
            'timestamp': this.parse8601 (datetime),
            'datetime': datetime,
            'network': undefined,
            'address': undefined,
            'addressTo': this.safeString (transaction, 'to'),
            'addressFrom': this.safeString (transaction, 'from'),
            'tag': undefined,
            'tagTo': undefined,
            'tagFrom': undefined,
            'type': undefined,
            'amount': this.safeNumber (transaction, 'value'),
            'currency': this.safeCurrencyCode (undefined, currency),
            'status': 'ok',
            'updated': undefined,
            'internal': undefined,
            'comment': undefined,
            'fee': undefined,
        };
    }

    /**
     * @method
     * @name timex#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Public/listTickers
     * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        const period = this.safeString (this.options['fetchTickers'], 'period', '1d');
        const request: Dict = {
            'period': this.timeframes[period], // I1, I5, I15, I30, H1, H2, H4, H6, H12, D1, W1
        };
        const response = await this.publicGetTickers (this.extend (request, params));
        //
        //     [
        //         {
        //             "ask": 0.017,
        //             "bid": 0.016,
        //             "high": 0.019,
        //             "last": 0.017,
        //             "low": 0.015,
        //             "market": "TIME/ETH",
        //             "open": 0.016,
        //             "period": "H1",
        //             "timestamp": "2018-12-14T20:50:36.134Z",
        //             "volume": 4.57,
        //             "volumeQuote": 0.07312
        //         }
        //     ]
        //
        return this.parseTickers (response, symbols);
    }

    /**
     * @method
     * @name timex#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Public/listTickers
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const period = this.safeString (this.options['fetchTickers'], 'period', '1d');
        const request: Dict = {
            'market': market['id'],
            'period': this.timeframes[period], // I1, I5, I15, I30, H1, H2, H4, H6, H12, D1, W1
        };
        const response = await this.publicGetTickers (this.extend (request, params));
        //
        //     [
        //         {
        //             "ask": 0.017,
        //             "bid": 0.016,
        //             "high": 0.019,
        //             "last": 0.017,
        //             "low": 0.015,
        //             "market": "TIME/ETH",
        //             "open": 0.016,
        //             "period": "H1",
        //             "timestamp": "2018-12-14T20:50:36.134Z",
        //             "volume": 4.57,
        //             "volumeQuote": 0.07312
        //         }
        //     ]
        //
        const ticker = this.safeDict (response, 0);
        return this.parseTicker (ticker, market);
    }

    /**
     * @method
     * @name timex#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Public/orderbookV2
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'market': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.publicGetOrderbookV2 (this.extend (request, params));
        //
        //     {
        //         "timestamp":"2019-12-05T00:21:09.538",
        //         "bid":[
        //             {
        //                 "index":"2",
        //                 "price":"0.02024007",
        //                 "baseTokenAmount":"0.0096894",
        //                 "baseTokenCumulativeAmount":"0.0096894",
        //                 "quoteTokenAmount":"0.000196114134258",
        //                 "quoteTokenCumulativeAmount":"0.000196114134258"
        //             },
        //         "ask":[
        //             {
        //                 "index":"-3",
        //                 "price":"0.02024012",
        //                 "baseTokenAmount":"0.005",
        //                 "baseTokenCumulativeAmount":"0.005",
        //                 "quoteTokenAmount":"0.0001012006",
        //                 "quoteTokenCumulativeAmount":"0.0001012006"
        //             },
        //         ]
        //     }
        //
        const timestamp = this.parse8601 (this.safeString (response, 'timestamp'));
        return this.parseOrderBook (response, symbol, timestamp, 'bid', 'ask', 'price', 'baseTokenAmount');
    }

    /**
     * @method
     * @name timex#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Public/listTrades
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const options = this.safeValue (this.options, 'fetchTrades', {});
        const defaultSort = this.safeValue (options, 'sort', 'timestamp,asc');
        const sort = this.safeString (params, 'sort', defaultSort);
        const query = this.omit (params, 'sort');
        const request: Dict = {
            // 'address': 'string', // trade’s member account (?)
            // 'cursor': 1234, // int64 (?)
            // 'from': this.iso8601 (since),
            'market': market['id'],
            // 'page': 0, // results page you want to retrieve 0 .. N
            // 'size': limit, // number of records per page, 100 by default
            'sort': sort, // array[string], sorting criteria in the format "property,asc" or "property,desc", default is ascending
            // 'till': this.iso8601 (this.milliseconds ()),
        };
        if (since !== undefined) {
            request['from'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['size'] = limit; // default is 100
        }
        const response = await this.publicGetTrades (this.extend (request, query));
        //
        //     [
        //         {
        //             "id":1,
        //             "timestamp":"2019-06-25T17:01:50.309",
        //             "direction":"BUY",
        //             "price":"0.027",
        //             "quantity":"0.001"
        //         }
        //     ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    /**
     * @method
     * @name timex#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Public/listCandles
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest candle to fetch
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'market': market['id'],
            'period': this.safeString (this.timeframes, timeframe, timeframe),
        };
        // if since and limit are not specified
        const duration = this.parseTimeframe (timeframe);
        const until = this.safeInteger (params, 'until');
        if (limit === undefined) {
            limit = 1000; // exchange provides tens of thousands of data, but we set generous default value
        }
        if (since !== undefined) {
            request['from'] = this.iso8601 (since);
            if (until === undefined) {
                request['till'] = this.iso8601 (this.sum (since, this.sum (limit, 1) * duration * 1000));
            } else {
                request['till'] = this.iso8601 (until);
            }
        } else if (until !== undefined) {
            request['till'] = this.iso8601 (until);
            const fromTimestamp = until - this.sum (limit, 1) * duration * 1000;
            request['from'] = this.iso8601 (fromTimestamp);
        } else {
            const now = this.milliseconds ();
            request['till'] = this.iso8601 (now);
            request['from'] = this.iso8601 (now - this.sum (limit, 1) * duration * 1000 - 1);
        }
        params = this.omit (params, 'until');
        const response = await this.publicGetCandles (this.extend (request, params));
        //
        //     [
        //         {
        //             "timestamp":"2019-12-04T23:00:00",
        //             "open":"0.02024009",
        //             "high":"0.02024009",
        //             "low":"0.02024009",
        //             "close":"0.02024009",
        //             "volume":"0.00008096036",
        //             "volumeQuote":"0.004",
        //         },
        //     ]
        //
        return this.parseOHLCVs (response, market, timeframe, since, limit);
    }

    parseBalance (response): Balances {
        const result: Dict = {
            'info': response,
            'timestamp': undefined,
            'datetime': undefined,
        };
        for (let i = 0; i < response.length; i++) {
            const balance = response[i];
            const currencyId = this.safeString (balance, 'currency');
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            account['total'] = this.safeString (balance, 'totalBalance');
            account['used'] = this.safeString (balance, 'lockedBalance');
            result[code] = account;
        }
        return this.safeBalance (result);
    }

    /**
     * @method
     * @name timex#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Trading/getBalances
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance (params = {}): Promise<Balances> {
        await this.loadMarkets ();
        const response = await this.tradingGetBalances (params);
        //
        //     [
        //         {"currency":"BTC","totalBalance":"0","lockedBalance":"0"},
        //         {"currency":"AUDT","totalBalance":"0","lockedBalance":"0"},
        //         {"currency":"ETH","totalBalance":"0","lockedBalance":"0"},
        //         {"currency":"TIME","totalBalance":"0","lockedBalance":"0"},
        //         {"currency":"USDT","totalBalance":"0","lockedBalance":"0"}
        //     ]
        //
        return this.parseBalance (response);
    }

    /**
     * @method
     * @name timex#createOrder
     * @description create a trade order
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Trading/createOrder
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
        const uppercaseSide = side.toUpperCase ();
        let uppercaseType = type.toUpperCase ();
        const postOnly = this.safeBool (params, 'postOnly', false);
        if (postOnly) {
            uppercaseType = 'POST_ONLY';
            params = this.omit (params, [ 'postOnly' ]);
        }
        const request: Dict = {
            'symbol': market['id'],
            'quantity': this.amountToPrecision (symbol, amount),
            'side': uppercaseSide,
            'orderTypes': uppercaseType,
            // 'clientOrderId': '123',
            // 'expireIn': 1575523308, // in seconds
            // 'expireTime': 1575523308, // unix timestamp
        };
        let query = params;
        if ((uppercaseType === 'LIMIT') || (uppercaseType === 'POST_ONLY')) {
            request['price'] = this.priceToPrecision (symbol, price);
            const defaultExpireIn = this.safeInteger (this.options, 'expireIn');
            const expireTime = this.safeValue (params, 'expireTime');
            const expireIn = this.safeValue (params, 'expireIn', defaultExpireIn);
            if (expireTime !== undefined) {
                request['expireTime'] = expireTime;
            } else if (expireIn !== undefined) {
                request['expireIn'] = expireIn;
            } else {
                throw new InvalidOrder (this.id + ' createOrder() method requires a expireTime or expireIn param for a ' + type + ' order, you can also set the expireIn exchange-wide option');
            }
            query = this.omit (params, [ 'expireTime', 'expireIn' ]);
        } else {
            request['price'] = 0;
        }
        const response = await this.tradingPostOrders (this.extend (request, query));
        //
        //     {
        //         "orders": [
        //             {
        //                 "cancelledQuantity": "0.3",
        //                 "clientOrderId": "my-order-1",
        //                 "createdAt": "1970-01-01T00:00:00",
        //                 "cursorId": 50,
        //                 "expireTime": "1970-01-01T00:00:00",
        //                 "filledQuantity": "0.3",
        //                 "id": "string",
        //                 "price": "0.017",
        //                 "quantity": "0.3",
        //                 "side": "BUY",
        //                 "symbol": "TIMEETH",
        //                 "type": "LIMIT",
        //                 "updatedAt": "1970-01-01T00:00:00"
        //             }
        //         ]
        //     }
        //
        const orders = this.safeValue (response, 'orders', []);
        const order = this.safeDict (orders, 0, {});
        return this.parseOrder (order, market);
    }

    async editOrder (id: string, symbol: string, type: OrderType, side: OrderSide, amount: Num = undefined, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'id': id,
        };
        if (amount !== undefined) {
            request['quantity'] = this.amountToPrecision (symbol, amount);
        }
        if (price !== undefined) {
            request['price'] = this.priceToPrecision (symbol, price);
        }
        const response = await this.tradingPutOrders (this.extend (request, params));
        //
        //     {
        //         "changedOrders": [
        //             {
        //                 "newOrder": {
        //                 "cancelledQuantity": "0.3",
        //                 "clientOrderId": "my-order-1",
        //                 "createdAt": "1970-01-01T00:00:00",
        //                 "cursorId": 50,
        //                 "expireTime": "1970-01-01T00:00:00",
        //                 "filledQuantity": "0.3",
        //                 "id": "string",
        //                 "price": "0.017",
        //                 "quantity": "0.3",
        //                 "side": "BUY",
        //                 "symbol": "TIMEETH",
        //                 "type": "LIMIT",
        //                 "updatedAt": "1970-01-01T00:00:00"
        //                 },
        //                 "oldId": "string",
        //             },
        //         ],
        //         "unchangedOrders": [ "string" ],
        //     }
        //
        if ('unchangedOrders' in response) {
            const orderIds = this.safeValue (response, 'unchangedOrders', []);
            const orderId = this.safeString (orderIds, 0);
            return this.safeOrder ({
                'id': orderId,
                'info': response,
            });
        }
        const orders = this.safeValue (response, 'changedOrders', []);
        const firstOrder = this.safeValue (orders, 0, {});
        const order = this.safeDict (firstOrder, 'newOrder', {});
        return this.parseOrder (order, market);
    }

    /**
     * @method
     * @name timex#cancelOrder
     * @description cancels an open order
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Trading/deleteOrders
     * @param {string} id order id
     * @param {string} symbol not used by timex cancelOrder ()
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        const orders = await this.cancelOrders ([ id ], symbol, params);
        return this.safeDict (orders, 0) as Order;
    }

    /**
     * @method
     * @name timex#cancelOrders
     * @description cancel multiple orders
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Trading/deleteOrders
     * @param {string[]} ids order ids
     * @param {string} symbol unified market symbol, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrders (ids, symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {
            'id': ids,
        };
        const response = await this.tradingDeleteOrders (this.extend (request, params));
        //
        //     {
        //         "changedOrders": [
        //             {
        //                 "newOrder": {
        //                     "cancelledQuantity": "0.3",
        //                     "clientOrderId": "my-order-1",
        //                     "createdAt": "1970-01-01T00:00:00",
        //                     "cursorId": 50,
        //                     "expireTime": "1970-01-01T00:00:00",
        //                     "filledQuantity": "0.3",
        //                     "id": "string",
        //                     "price": "0.017",
        //                     "quantity": "0.3",
        //                     "side": "BUY",
        //                     "symbol": "TIMEETH",
        //                     "type": "LIMIT",
        //                     "updatedAt": "1970-01-01T00:00:00"
        //                 },
        //                 "oldId": "string",
        //             },
        //         ],
        //         "unchangedOrders": [ "string" ],
        //     }
        //
        const changedOrders = this.safeList (response, 'changedOrders', []);
        const unchangedOrders = this.safeList (response, 'unchangedOrders', []);
        const orders = [];
        for (let i = 0; i < changedOrders.length; i++) {
            const newOrder = this.safeDict (changedOrders[i], 'newOrder');
            orders.push (this.parseOrder (newOrder));
        }
        for (let i = 0; i < unchangedOrders.length; i++) {
            orders.push (this.safeOrder ({
                'info': unchangedOrders[i],
                'id': unchangedOrders[i],
                'status': 'unchanged',
            }));
        }
        return orders;
    }

    /**
     * @method
     * @name timex#fetchOrder
     * @description fetches information on an order made by the user
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/History/getOrderDetails
     * @param {string} id order id
     * @param {string} symbol not used by timex fetchOrder
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrder (id: string, symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {
            'orderHash': id,
        };
        const response = await this.historyGetOrdersDetails (request);
        //
        //     {
        //         "order": {
        //             "cancelledQuantity": "0.3",
        //             "clientOrderId": "my-order-1",
        //             "createdAt": "1970-01-01T00:00:00",
        //             "cursorId": 50,
        //             "expireTime": "1970-01-01T00:00:00",
        //             "filledQuantity": "0.3",
        //             "id": "string",
        //             "price": "0.017",
        //             "quantity": "0.3",
        //             "side": "BUY",
        //             "symbol": "TIMEETH",
        //             "type": "LIMIT",
        //             "updatedAt": "1970-01-01T00:00:00"
        //         },
        //         "trades": [
        //             {
        //                 "fee": "0.3",
        //                 "id": 100,
        //                 "makerOrTaker": "MAKER",
        //                 "makerOrderId": "string",
        //                 "price": "0.017",
        //                 "quantity": "0.3",
        //                 "side": "BUY",
        //                 "symbol": "TIMEETH",
        //                 "takerOrderId": "string",
        //                 "timestamp": "2019-12-05T07:48:26.310Z"
        //             }
        //         ]
        //     }
        //
        const order = this.safeValue (response, 'order', {});
        const trades = this.safeList (response, 'trades', []);
        return this.parseOrder (this.extend (order, { 'trades': trades }));
    }

    /**
     * @method
     * @name timex#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Trading/getOpenOrders
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of  open orders structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        const options = this.safeValue (this.options, 'fetchOpenOrders', {});
        const defaultSort = this.safeValue (options, 'sort', 'createdAt,asc');
        const sort = this.safeString (params, 'sort', defaultSort);
        const query = this.omit (params, 'sort');
        const request: Dict = {
            // 'clientOrderId': '123', // order’s client id list for filter
            // page: 0, // results page you want to retrieve (0 .. N)
            'sort': sort, // sorting criteria in the format "property,asc" or "property,desc", default order is ascending, multiple sort criteria are supported
        };
        let market: Market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (limit !== undefined) {
            request['size'] = limit;
        }
        const response = await this.tradingGetOrders (this.extend (request, query));
        //
        //     {
        //         "orders": [
        //             {
        //                 "cancelledQuantity": "0.3",
        //                 "clientOrderId": "my-order-1",
        //                 "createdAt": "1970-01-01T00:00:00",
        //                 "cursorId": 50,
        //                 "expireTime": "1970-01-01T00:00:00",
        //                 "filledQuantity": "0.3",
        //                 "id": "string",
        //                 "price": "0.017",
        //                 "quantity": "0.3",
        //                 "side": "BUY",
        //                 "symbol": "TIMEETH",
        //                 "type": "LIMIT",
        //                 "updatedAt": "1970-01-01T00:00:00"
        //             }
        //         ]
        //     }
        //
        const orders = this.safeList (response, 'orders', []);
        return this.parseOrders (orders, market, since, limit);
    }

    /**
     * @method
     * @name timex#fetchClosedOrders
     * @description fetches information on multiple closed orders made by the user
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/History/getOrders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchClosedOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        const options = this.safeValue (this.options, 'fetchClosedOrders', {});
        const defaultSort = this.safeValue (options, 'sort', 'createdAt,asc');
        const sort = this.safeString (params, 'sort', defaultSort);
        const query = this.omit (params, 'sort');
        const request: Dict = {
            // 'clientOrderId': '123', // order’s client id list for filter
            // page: 0, // results page you want to retrieve (0 .. N)
            'sort': sort, // sorting criteria in the format "property,asc" or "property,desc", default order is ascending, multiple sort criteria are supported
            'side': 'BUY', // or 'SELL'
            // 'till': this.iso8601 (this.milliseconds ()),
        };
        let market: Market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['from'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['size'] = limit;
        }
        const response = await this.historyGetOrders (this.extend (request, query));
        //
        //     {
        //         "orders": [
        //             {
        //                 "cancelledQuantity": "0.3",
        //                 "clientOrderId": "my-order-1",
        //                 "createdAt": "1970-01-01T00:00:00",
        //                 "cursorId": 50,
        //                 "expireTime": "1970-01-01T00:00:00",
        //                 "filledQuantity": "0.3",
        //                 "id": "string",
        //                 "price": "0.017",
        //                 "quantity": "0.3",
        //                 "side": "BUY",
        //                 "symbol": "TIMEETH",
        //                 "type": "LIMIT",
        //                 "updatedAt": "1970-01-01T00:00:00"
        //             }
        //         ]
        //     }
        //
        const orders = this.safeList (response, 'orders', []);
        return this.parseOrders (orders, market, since, limit);
    }

    /**
     * @method
     * @name timex#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/History/getTrades_1
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const options = this.safeValue (this.options, 'fetchMyTrades', {});
        const defaultSort = this.safeValue (options, 'sort', 'timestamp,asc');
        const sort = this.safeString (params, 'sort', defaultSort);
        const query = this.omit (params, 'sort');
        const request: Dict = {
            // 'cursorId': 123, // int64 (?)
            // 'from': this.iso8601 (since),
            // 'makerOrderId': '1234', // maker order hash
            // 'owner': '...', // owner address (?)
            // 'page': 0, // results page you want to retrieve (0 .. N)
            // 'side': 'BUY', // or 'SELL'
            // 'size': limit,
            'sort': sort, // sorting criteria in the format "property,asc" or "property,desc", default order is ascending, multiple sort criteria are supported
            // 'symbol': market['id'],
            // 'takerOrderId': '1234',
            // 'till': this.iso8601 (this.milliseconds ()),
        };
        let market: Market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['from'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['size'] = limit;
        }
        const response = await this.historyGetTrades (this.extend (request, query));
        //
        //     {
        //         "trades": [
        //             {
        //                 "fee": "0.3",
        //                 "id": 100,
        //                 "makerOrTaker": "MAKER",
        //                 "makerOrderId": "string",
        //                 "price": "0.017",
        //                 "quantity": "0.3",
        //                 "side": "BUY",
        //                 "symbol": "TIMEETH",
        //                 "takerOrderId": "string",
        //                 "timestamp": "2019-12-08T04:54:11.171Z"
        //             }
        //         ]
        //     }
        //
        const trades = this.safeList (response, 'trades', []);
        return this.parseTrades (trades, market, since, limit);
    }

    parseTradingFee (fee: Dict, market: Market = undefined): TradingFeeInterface {
        //
        //     {
        //         "fee": 0.0075,
        //         "market": "ETHBTC"
        //     }
        //
        const marketId = this.safeString (fee, 'market');
        const rate = this.safeNumber (fee, 'fee');
        return {
            'info': fee,
            'symbol': this.safeSymbol (marketId, market),
            'maker': rate,
            'taker': rate,
            'percentage': undefined,
            'tierBased': undefined,
        };
    }

    /**
     * @method
     * @name timex#fetchTradingFee
     * @description fetch the trading fees for a market
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Trading/getFees
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [fee structure]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchTradingFee (symbol: string, params = {}): Promise<TradingFeeInterface> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'markets': market['id'],
        };
        const response = await this.tradingGetFees (this.extend (request, params));
        //
        //     [
        //         {
        //             "fee": 0.0075,
        //             "market": "ETHBTC"
        //         }
        //     ]
        //
        const result = this.safeValue (response, 0, {});
        return this.parseTradingFee (result, market);
    }

    parseMarket (market: Dict): Market {
        //
        //     {
        //         "symbol": "ETHBTC",
        //         "name": "ETH/BTC",
        //         "baseCurrency": "ETH",
        //         "baseTokenAddress": "0x45932db54b38af1f5a57136302eeba66a5975c15",
        //         "quoteCurrency": "BTC",
        //         "quoteTokenAddress": "0x8370fbc6ddec1e18b4e41e72ed943e238458487c",
        //         "feeCurrency": "BTC",
        //         "feeTokenAddress": "0x8370fbc6ddec1e18b4e41e72ed943e238458487c",
        //         "quantityIncrement": "0.0000001",
        //         "takerFee": "0.005",
        //         "makerFee": "0.0025",
        //         "tickSize": "0.00000001",
        //         "baseMinSize": "0.0001",
        //         "quoteMinSize": "0.00001",
        //         "locked": false
        //     }
        //
        const locked = this.safeValue (market, 'locked');
        const id = this.safeString (market, 'symbol');
        const baseId = this.safeString (market, 'baseCurrency');
        const quoteId = this.safeString (market, 'quoteCurrency');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const amountIncrement = this.safeString (market, 'quantityIncrement');
        const minBase = this.safeString (market, 'baseMinSize');
        const minAmount = Precise.stringMax (amountIncrement, minBase);
        const priceIncrement = this.safeString (market, 'tickSize');
        const minCost = this.safeNumber (market, 'quoteMinSize');
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
            'active': !locked,
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'taker': this.safeNumber (market, 'takerFee'),
            'maker': this.safeNumber (market, 'makerFee'),
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.safeNumber (market, 'quantityIncrement'),
                'price': this.safeNumber (market, 'tickSize'),
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': this.parseNumber (minAmount),
                    'max': undefined,
                },
                'price': {
                    'min': this.parseNumber (priceIncrement),
                    'max': undefined,
                },
                'cost': {
                    'min': minCost,
                    'max': undefined,
                },
            },
            'created': undefined,
            'info': market,
        };
    }

    parseCurrency (currency: Dict): Currency {
        //
        //     {
        //         "symbol": "BTC",
        //         "name": "Bitcoin",
        //         "address": "0x8370fbc6ddec1e18b4e41e72ed943e238458487c",
        //         "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR...mc+Cg==",
        //         "background": "transparent",
        //         "fiatSymbol": "BTC",
        //         "decimals": 8,
        //         "tradeDecimals": 20,
        //         "displayDecimals": 4,
        //         "crypto": true,
        //         "depositEnabled": true,
        //         "withdrawalEnabled": true,
        //         "transferEnabled": true,
        //         "buyEnabled": false,
        //         "purchaseEnabled": false,
        //         "redeemEnabled": false,
        //         "active": true,
        //         "withdrawalFee": "50000000000000000",
        //         "purchaseCommissions": []
        //     }
        //
        // https://github.com/ccxt/ccxt/issues/6878
        //
        //     {
        //         "symbol":"XRP",
        //         "name":"Ripple",
        //         "address":"0x0dc8882914f3ddeebf4cec6dc20edb99df3def6c",
        //         "decimals":6,
        //         "tradeDecimals":16,
        //         "depositEnabled":true,
        //         "withdrawalEnabled":true,
        //         "transferEnabled":true,
        //         "active":true
        //     }
        //
        const id = this.safeString (currency, 'symbol');
        const code = this.safeCurrencyCode (id);
        // const fee = this.safeNumber (currency, 'withdrawalFee');
        const feeString = this.safeString (currency, 'withdrawalFee');
        const tradeDecimals = this.safeInteger (currency, 'tradeDecimals');
        let fee = undefined;
        if ((feeString !== undefined) && (tradeDecimals !== undefined)) {
            const feeStringLen = feeString.length;
            const dotIndex = feeStringLen - tradeDecimals;
            if (dotIndex > 0) {
                const whole = feeString.slice (0, dotIndex);
                const fraction = feeString.slice (-dotIndex);
                fee = this.parseNumber (whole + '.' + fraction);
            } else {
                let fraction = '.';
                for (let i = 0; i < -dotIndex; i++) {
                    fraction += '0';
                }
                fee = this.parseNumber (fraction + feeString);
            }
        }
        return this.safeCurrencyStructure ({
            'id': code,
            'code': code,
            'info': currency,
            'type': undefined,
            'name': this.safeString (currency, 'name'),
            'active': this.safeBool (currency, 'active'),
            'deposit': this.safeBool (currency, 'depositEnabled'),
            'withdraw': this.safeBool (currency, 'withdrawalEnabled'),
            'fee': fee,
            'precision': this.parseNumber (this.parsePrecision (this.safeString (currency, 'decimals'))),
            'limits': {
                'withdraw': { 'min': undefined, 'max': undefined },
                'amount': { 'min': undefined, 'max': undefined },
            },
            'networks': {},
        });
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        //
        //     {
        //         "ask": 0.017,
        //         "bid": 0.016,
        //         "high": 0.019,
        //         "last": 0.017,
        //         "low": 0.015,
        //         "market": "TIME/ETH",
        //         "open": 0.016,
        //         "period": "H1",
        //         "timestamp": "2018-12-14T20:50:36.134Z",
        //         "volume": 4.57,
        //         "volumeQuote": 0.07312
        //     }
        //
        const marketId = this.safeString (ticker, 'market');
        const symbol = this.safeSymbol (marketId, market, '/');
        const timestamp = this.parse8601 (this.safeString (ticker, 'timestamp'));
        const last = this.safeString (ticker, 'last');
        const open = this.safeString (ticker, 'open');
        return this.safeTicker ({
            'symbol': symbol,
            'info': ticker,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'high'),
            'low': this.safeString (ticker, 'low'),
            'bid': this.safeString (ticker, 'bid'),
            'bidVolume': undefined,
            'ask': this.safeString (ticker, 'ask'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'volume'),
            'quoteVolume': this.safeString (ticker, 'volumeQuote'),
        }, market);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        //
        // fetchTrades (public)
        //
        //     {
        //         "id":1,
        //         "timestamp":"2019-06-25T17:01:50.309",
        //         "direction":"BUY",
        //         "price":"0.027",
        //         "quantity":"0.001"
        //     }
        //
        // fetchMyTrades, fetchOrder (private)
        //
        //     {
        //         "id": "7613414",
        //         "makerOrderId": "0x8420af060722f560098f786a2894d4358079b6ea5d14b395969ed77bc87a623a",
        //         "takerOrderId": "0x1235ef158a361815b54c9988b6241c85aedcbc1fe81caf8df8587d5ab0373d1a",
        //         "symbol": "LTCUSDT",
        //         "side": "BUY",
        //         "quantity": "0.2",
        //         "fee": "0.22685",
        //         "feeToken": "USDT",
        //         "price": "226.85",
        //         "makerOrTaker": "TAKER",
        //         "timestamp": "2021-04-09T15:39:45.608"
        //    }
        //
        const marketId = this.safeString (trade, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const timestamp = this.parse8601 (this.safeString (trade, 'timestamp'));
        const priceString = this.safeString (trade, 'price');
        const amountString = this.safeString (trade, 'quantity');
        const price = this.parseNumber (priceString);
        const amount = this.parseNumber (amountString);
        const cost = this.parseNumber (Precise.stringMul (priceString, amountString));
        const id = this.safeString (trade, 'id');
        const side = this.safeStringLower2 (trade, 'direction', 'side');
        const takerOrMaker = this.safeStringLower (trade, 'makerOrTaker');
        let orderId: Str = undefined;
        if (takerOrMaker !== undefined) {
            orderId = this.safeString (trade, takerOrMaker + 'OrderId');
        }
        let fee = undefined;
        const feeCost = this.safeNumber (trade, 'fee');
        const feeCurrency = this.safeCurrencyCode (this.safeString (trade, 'feeToken'));
        if (feeCost !== undefined) {
            fee = {
                'cost': feeCost,
                'currency': feeCurrency,
            };
        }
        return this.safeTrade ({
            'info': trade,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'order': orderId,
            'type': undefined,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': cost,
            'takerOrMaker': takerOrMaker,
            'fee': fee,
        });
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        //
        //     {
        //         "timestamp":"2019-12-04T23:00:00",
        //         "open":"0.02024009",
        //         "high":"0.02024009",
        //         "low":"0.02024009",
        //         "close":"0.02024009",
        //         "volume":"0.00008096036",
        //         "volumeQuote":"0.004",
        //     }
        //
        return [
            this.parse8601 (this.safeString (ohlcv, 'timestamp')),
            this.safeNumber (ohlcv, 'open'),
            this.safeNumber (ohlcv, 'high'),
            this.safeNumber (ohlcv, 'low'),
            this.safeNumber (ohlcv, 'close'),
            this.safeNumber (ohlcv, 'volume'),
        ];
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        //
        // fetchOrder, createOrder, cancelOrder, cancelOrders, fetchOpenOrders, fetchClosedOrders
        //
        //     {
        //         "cancelledQuantity": "0.3",
        //         "clientOrderId": "my-order-1",
        //         "createdAt": "1970-01-01T00:00:00",
        //         "cursorId": 50,
        //         "expireTime": "1970-01-01T00:00:00",
        //         "filledQuantity": "0.3",
        //         "id": "string",
        //         "price": "0.017",
        //         "quantity": "0.3",
        //         "side": "BUY",
        //         "symbol": "TIMEETH",
        //         "type": "LIMIT",
        //         "updatedAt": "1970-01-01T00:00:00"
        //         "trades": [], // injected from the outside
        //     }
        //
        const id = this.safeString (order, 'id');
        const type = this.safeStringLower (order, 'type');
        const side = this.safeStringLower (order, 'side');
        const marketId = this.safeString (order, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const timestamp = this.parse8601 (this.safeString (order, 'createdAt'));
        const price = this.safeString (order, 'price');
        const amount = this.safeString (order, 'quantity');
        const filled = this.safeString (order, 'filledQuantity');
        const canceledQuantity = this.omitZero (this.safeString (order, 'cancelledQuantity'));
        let status: string;
        if (Precise.stringEquals (filled, amount)) {
            status = 'closed';
        } else if (canceledQuantity !== undefined) {
            status = 'canceled';
        } else {
            status = 'open';
        }
        const rawTrades = this.safeValue (order, 'trades', []);
        const clientOrderId = this.safeString (order, 'clientOrderId');
        return this.safeOrder ({
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'symbol': symbol,
            'type': type,
            'timeInForce': undefined,
            'postOnly': undefined,
            'side': side,
            'price': price,
            'triggerPrice': undefined,
            'amount': amount,
            'cost': undefined,
            'average': undefined,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': undefined,
            'trades': rawTrades,
        }, market);
    }

    /**
     * @method
     * @name timex#fetchDepositAddress
     * @description fetch the deposit address for a currency associated with this account, does not accept params["network"]
     * @see https://plasma-relay-backend.timex.io/swagger-ui/index.html?urls.primaryName=Relay#/Currency/selectCurrencyBySymbol
     * @param {string} code unified currency code
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
     */
    async fetchDepositAddress (code: string, params = {}): Promise<DepositAddress> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'symbol': currency['code'],
        };
        const response = await this.currenciesGetSSymbol (this.extend (request, params));
        //
        //    {
        //        id: '1',
        //        currency: {
        //            symbol: 'BTC',
        //            name: 'Bitcoin',
        //            address: '0x8370fbc6ddec1e18b4e41e72ed943e238458487c',
        //            decimals: '8',
        //            tradeDecimals: '20',
        //            fiatSymbol: 'BTC',
        //            depositEnabled: true,
        //            withdrawalEnabled: true,
        //            transferEnabled: true,
        //            active: true
        //        }
        //    }
        //
        const data = this.safeDict (response, 'currency', {});
        return this.parseDepositAddress (data, currency);
    }

    parseDepositAddress (depositAddress, currency: Currency = undefined): DepositAddress {
        //
        //    {
        //        symbol: 'BTC',
        //        name: 'Bitcoin',
        //        address: '0x8370fbc6ddec1e18b4e41e72ed943e238458487c',
        //        decimals: '8',
        //        tradeDecimals: '20',
        //        fiatSymbol: 'BTC',
        //        depositEnabled: true,
        //        withdrawalEnabled: true,
        //        transferEnabled: true,
        //        active: true
        //    }
        //
        const currencyId = this.safeString (depositAddress, 'symbol');
        return {
            'info': depositAddress,
            'currency': this.safeCurrencyCode (currencyId, currency),
            'network': undefined,
            'address': this.safeString (depositAddress, 'address'),
            'tag': undefined,
        } as DepositAddress;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const paramsToExtract = this.extractParams (path);
        path = this.implodeParams (path, params);
        params = this.omit (params, paramsToExtract);
        let url = this.urls['api']['rest'] + '/' + api + '/' + path;
        if (Object.keys (params).length) {
            url += '?' + this.urlencodeWithArrayRepeat (params);
        }
        if (api !== 'public' && api !== 'tradingview') {
            this.checkRequiredCredentials ();
            const auth = this.stringToBase64 (this.apiKey + ':' + this.secret);
            const secret = 'Basic ' + auth;
            headers = { 'authorization': secret };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (statusCode: int, statusText: string, url: string, method: string, responseHeaders: Dict, responseBody, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined;
        }
        if (statusCode >= 400) {
            //
            //     {"error":{"timestamp":"05.12.2019T05:25:43.584+0000","status":"BAD_REQUEST","message":"Insufficient ETH balance. Required: 1, actual: 0.","code":4001}}
            //     {"error":{"timestamp":"05.12.2019T04:03:25.419+0000","status":"FORBIDDEN","message":"Access denied","code":4300}}
            //
            const feedback = this.id + ' ' + responseBody;
            let error = this.safeValue (response, 'error');
            if (error === undefined) {
                error = response;
            }
            const code = this.safeString2 (error, 'code', 'status');
            const message = this.safeString2 (error, 'message', 'debugMessage');
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, feedback);
            this.throwExactlyMatchedException (this.exceptions['exact'], code, feedback);
            this.throwExactlyMatchedException (this.exceptions['exact'], message, feedback);
            throw new ExchangeError (feedback);
        }
        return undefined;
    }
}
