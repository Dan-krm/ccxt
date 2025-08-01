'use strict';

var coinbaseexchange$1 = require('./abstract/coinbaseexchange.js');
var errors = require('./base/errors.js');
var Precise = require('./base/Precise.js');
var number = require('./base/functions/number.js');
var sha256 = require('./static_dependencies/noble-hashes/sha256.js');

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
/**
 * @class coinbaseexchange
 * @augments Exchange
 */
class coinbaseexchange extends coinbaseexchange$1 {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'coinbaseexchange',
            'name': 'Coinbase Exchange',
            'countries': ['US'],
            'rateLimit': 100,
            'userAgent': this.userAgents['chrome'],
            'pro': true,
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
                'cancelAllOrders': true,
                'cancelOrder': true,
                'closeAllPositions': false,
                'closePosition': false,
                'createDepositAddress': true,
                'createOrder': true,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createOrderWithTakeProfitAndStopLossWs': false,
                'createPostOnlyOrder': false,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': true,
                'createStopMarketOrder': true,
                'createStopOrder': true,
                'fetchAccounts': true,
                'fetchBalance': true,
                'fetchBorrowInterest': false,
                'fetchBorrowRate': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchClosedOrders': true,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDepositAddress': false,
                'fetchDeposits': true,
                'fetchDepositsWithdrawals': true,
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
                'fetchLedger': true,
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
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchOrderTrades': true,
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
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': true,
                'fetchTransactions': 'emulated',
                'fetchVolatilityHistory': false,
                'fetchWithdrawals': true,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'repayMargin': false,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'withdraw': true,
            },
            'timeframes': {
                '1m': 60,
                '5m': 300,
                '15m': 900,
                '1h': 3600,
                '6h': 21600,
                '1d': 86400,
            },
            'hostname': 'exchange.coinbase.com',
            'urls': {
                'test': {
                    'public': 'https://api-public.sandbox.exchange.coinbase.com',
                    'private': 'https://api-public.sandbox.exchange.coinbase.com',
                },
                'logo': 'https://github.com/ccxt/ccxt/assets/43336371/34a65553-88aa-4a38-a714-064bd228b97e',
                'api': {
                    'public': 'https://api.{hostname}',
                    'private': 'https://api.{hostname}',
                },
                'www': 'https://coinbase.com/',
                'doc': 'https://docs.cloud.coinbase.com/exchange/docs/',
                'fees': [
                    'https://docs.pro.coinbase.com/#fees',
                    'https://support.pro.coinbase.com/customer/en/portal/articles/2945310-fees',
                ],
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'password': true,
            },
            'api': {
                'public': {
                    'get': [
                        'currencies',
                        'products',
                        'products/{id}',
                        'products/{id}/book',
                        'products/{id}/candles',
                        'products/{id}/stats',
                        'products/{id}/ticker',
                        'products/{id}/trades',
                        'time',
                        'products/spark-lines',
                        'products/volume-summary',
                    ],
                },
                'private': {
                    'get': [
                        'address-book',
                        'accounts',
                        'accounts/{id}',
                        'accounts/{id}/holds',
                        'accounts/{id}/ledger',
                        'accounts/{id}/transfers',
                        'coinbase-accounts',
                        'fills',
                        'funding',
                        'fees',
                        'margin/profile_information',
                        'margin/buying_power',
                        'margin/withdrawal_power',
                        'margin/withdrawal_power_all',
                        'margin/exit_plan',
                        'margin/liquidation_history',
                        'margin/position_refresh_amounts',
                        'margin/status',
                        'oracle',
                        'orders',
                        'orders/{id}',
                        'orders/client:{client_oid}',
                        'otc/orders',
                        'payment-methods',
                        'position',
                        'profiles',
                        'profiles/{id}',
                        'reports/{report_id}',
                        'transfers',
                        'transfers/{transfer_id}',
                        'users/self/exchange-limits',
                        'users/self/hold-balances',
                        'users/self/trailing-volume',
                        'withdrawals/fee-estimate',
                        'conversions/{conversion_id}',
                        'conversions/fees',
                    ],
                    'post': [
                        'conversions',
                        'deposits/coinbase-account',
                        'deposits/payment-method',
                        'coinbase-accounts/{id}/addresses',
                        'funding/repay',
                        'orders',
                        'position/close',
                        'profiles/margin-transfer',
                        'profiles/transfer',
                        'reports',
                        'withdrawals/coinbase',
                        'withdrawals/coinbase-account',
                        'withdrawals/crypto',
                        'withdrawals/payment-method',
                    ],
                    'delete': [
                        'orders',
                        'orders/client:{client_oid}',
                        'orders/{id}',
                    ],
                },
            },
            'commonCurrencies': {
                'CGLD': 'CELO',
            },
            'precisionMode': number.TICK_SIZE,
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber('0.004'),
                    'taker': this.parseNumber('0.006'), // highest fee of all tiers
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BCH': 0,
                        'BTC': 0,
                        'LTC': 0,
                        'ETH': 0,
                        'EUR': 0.15,
                        'USD': 25,
                    },
                    'deposit': {
                        'BCH': 0,
                        'BTC': 0,
                        'LTC': 0,
                        'ETH': 0,
                        'EUR': 0.15,
                        'USD': 10,
                    },
                },
            },
            'features': {
                'default': {
                    'sandbox': true,
                    'createOrder': {
                        'marginMode': true,
                        'triggerPrice': true,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false,
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        'timeInForce': {
                            'IOC': true,
                            'FOK': true,
                            'PO': true,
                            'GTD': true,
                        },
                        'hedged': false,
                        'trailing': false,
                        'leverage': false,
                        'marketBuyByCost': false,
                        'marketBuyRequiresPrice': false,
                        'selfTradePrevention': false,
                        'iceberg': true, // todo: implement
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'symbolRequired': true,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': 100,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOrders': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchClosedOrders': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': 100000,
                        'daysBackCanceled': 1,
                        'untilDays': 100000,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOHLCV': {
                        'limit': 300,
                    },
                },
                'spot': {
                    'extends': 'default',
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
            'options': {
                'networks': {
                    'BTC': 'bitcoin',
                    // LIGHTNING unsupported
                    'ETH': 'ethereum',
                    // TRON unsupported
                    'SOL': 'solana',
                    // BSC unsupported
                    'ARBONE': 'arbitrum',
                    'AVAXC': 'avacchain',
                    'MATIC': 'polygon',
                    'BASE': 'base',
                    'SUI': 'sui',
                    'OP': 'optimism',
                    'NEAR': 'near',
                    // CRONOS unsupported
                    // GNO unsupported
                    'APT': 'aptos',
                    // SCROLL unsupported
                    'KAVA': 'kava',
                    // TAIKO unsupported
                    // BOB unsupported
                    // LINEA unsupported
                    'BLAST': 'blast',
                    'XLM': 'stellar',
                    // RSK unsupported
                    'SEI': 'sei',
                    // TON unsupported
                    // MANTLE unsupported
                    'ADA': 'cardano',
                    // HYPE unsupported
                    'CORE': 'coredao',
                    'ALGO': 'algorand',
                    // RUNE unsupported
                    'OSMO': 'osmosis',
                    // XIN unsupported
                    'CELO': 'celo',
                    'HBAR': 'hedera',
                    // FTM unsupported
                    // WEMIX unsupported
                    'ZKSYNC': 'zksync',
                    // KLAY unsupported
                    // HT unsupported
                    // FSN unsupported
                    // EOS unsupported, eosio?
                    // ACA unsupported
                    'STX': 'stacks',
                    'XTZ': 'tezos',
                    // NEO unsupported
                    // METIS unsupported
                    // TLOS unsupported
                    'EGLD': 'elrond',
                    // ASTR unsupported
                    // CFX unsupported
                    // GLMR unsupported
                    // CANTO unsupported
                    // SCRT unsupported
                    'LTC': 'litecoin',
                    // AURORA unsupported
                    // ONG unsupported
                    'ATOM': 'cosmos',
                    // CHZ unsupported
                    'FIL': 'filecoin',
                    'DOT': 'polkadot',
                    'DOGE': 'dogecoin',
                    // BRC20 unsupported
                    'XRP': 'ripple',
                    // XMR unsupported
                    'DASH': 'dash',
                    // akash, aleo,  axelar, bitcoincash, berachain, deso, ethereumclassic, unichain, flow, flare, dfinity, story,kusama,  mina, ronin, oasis, bittensor, celestia, noble, vara, vechain, zcash, horizen, zetachain
                },
            },
            'exceptions': {
                'exact': {
                    'Insufficient funds': errors.InsufficientFunds,
                    'NotFound': errors.OrderNotFound,
                    'Invalid API Key': errors.AuthenticationError,
                    'invalid signature': errors.AuthenticationError,
                    'Invalid Passphrase': errors.AuthenticationError,
                    'Invalid order id': errors.InvalidOrder,
                    'Private rate limit exceeded': errors.RateLimitExceeded,
                    'Trading pair not available': errors.PermissionDenied,
                    'Product not found': errors.InvalidOrder,
                },
                'broad': {
                    'Order already done': errors.OrderNotFound,
                    'order not found': errors.OrderNotFound,
                    'price too small': errors.InvalidOrder,
                    'price too precise': errors.InvalidOrder,
                    'under maintenance': errors.OnMaintenance,
                    'size is too small': errors.InvalidOrder,
                    'Cancel only mode': errors.OnMaintenance, // https://github.com/ccxt/ccxt/issues/7690
                },
            },
        });
    }
    /**
     * @method
     * @name coinbaseexchange#fetchCurrencies
     * @description fetches all available currencies on an exchange
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getcurrencies
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an associative dictionary of currencies
     */
    async fetchCurrencies(params = {}) {
        const response = await this.publicGetCurrencies(params);
        //
        //   {
        //     "id": "USDT",
        //     "name": "Tether",
        //     "min_size": "0.000001",
        //     "status": "online",
        //     "message": "",
        //     "max_precision": "0.000001",
        //     "convertible_to": [],
        //     "details": {
        //       "type": "crypto",
        //       "symbol": null,
        //       "network_confirmations": 14,
        //       "sort_order": 0,
        //       "crypto_address_link": "https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7?a={{address}}",
        //       "crypto_transaction_link": "https://etherscan.io/tx/0x{{txId}}",
        //       "push_payment_methods": [],
        //       "group_types": [],
        //       "display_name": null,
        //       "processing_time_seconds": null,
        //       "min_withdrawal_amount": 0.000001,
        //       "max_withdrawal_amount": 20000000
        //     },
        //     "default_network": "ethereum",
        //     "supported_networks": [
        //       {
        //         "id": "ethereum",
        //         "name": "Ethereum",
        //         "status": "online",
        //         "contract_address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        //         "crypto_address_link": "https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7?a={{address}}",
        //         "crypto_transaction_link": "https://etherscan.io/tx/0x{{txId}}",
        //         "min_withdrawal_amount": 0.000001,
        //         "max_withdrawal_amount": 20000000,
        //         "network_confirmations": 14,
        //         "processing_time_seconds": null
        //       }
        //     ],
        //     "display_name": "USDT"
        //   }
        //
        const result = {};
        for (let i = 0; i < response.length; i++) {
            const currency = response[i];
            const id = this.safeString(currency, 'id');
            const name = this.safeString(currency, 'name');
            const code = this.safeCurrencyCode(id);
            const details = this.safeDict(currency, 'details', {});
            const networks = {};
            const supportedNetworks = this.safeList(currency, 'supported_networks', []);
            for (let j = 0; j < supportedNetworks.length; j++) {
                const network = supportedNetworks[j];
                const networkId = this.safeString(network, 'id');
                const networkCode = this.networkIdToCode(networkId);
                networks[networkCode] = {
                    'id': networkId,
                    'name': this.safeString(network, 'name'),
                    'network': networkCode,
                    'active': this.safeString(network, 'status') === 'online',
                    'withdraw': undefined,
                    'deposit': undefined,
                    'fee': undefined,
                    'precision': undefined,
                    'limits': {
                        'withdraw': {
                            'min': this.safeNumber(network, 'min_withdrawal_amount'),
                            'max': this.safeNumber(network, 'max_withdrawal_amount'),
                        },
                    },
                    'contract': this.safeString(network, 'contract_address'),
                    'info': network,
                };
            }
            result[code] = this.safeCurrencyStructure({
                'id': id,
                'code': code,
                'info': currency,
                'type': this.safeString(details, 'type'),
                'name': name,
                'active': this.safeString(currency, 'status') === 'online',
                'deposit': undefined,
                'withdraw': undefined,
                'fee': undefined,
                'precision': this.safeNumber(currency, 'max_precision'),
                'limits': {
                    'amount': {
                        'min': this.safeNumber(details, 'min_size'),
                        'max': undefined,
                    },
                    'withdraw': {
                        'min': this.safeNumber(details, 'min_withdrawal_amount'),
                        'max': this.safeNumber(details, 'max_withdrawal_amount'),
                    },
                },
                'networks': networks,
            });
        }
        return result;
    }
    /**
     * @method
     * @name coinbaseexchange#fetchMarkets
     * @description retrieves data on all markets for coinbaseexchange
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproducts
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets(params = {}) {
        const response = await this.publicGetProducts(params);
        //
        //     [
        //         {
        //             "id": "BTCAUCTION-USD",
        //             "base_currency": "BTC",
        //             "quote_currency": "USD",
        //             "base_min_size": "0.000016",
        //             "base_max_size": "1500",
        //             "quote_increment": "0.01",
        //             "base_increment": "0.00000001",
        //             "display_name": "BTCAUCTION/USD",
        //             "min_market_funds": "1",
        //             "max_market_funds": "20000000",
        //             "margin_enabled": false,
        //             "fx_stablecoin": false,
        //             "max_slippage_percentage": "0.02000000",
        //             "post_only": false,
        //             "limit_only": false,
        //             "cancel_only": true,
        //             "trading_disabled": false,
        //             "status": "online",
        //             "status_message": '',
        //             "auction_mode": false
        //         },
        //         {
        //             "id": "BTC-USD",
        //             "base_currency": "BTC",
        //             "quote_currency": "USD",
        //             "base_min_size": "0.000016",
        //             "base_max_size": "1500",
        //             "quote_increment": "0.01",
        //             "base_increment": "0.00000001",
        //             "display_name": "BTC/USD",
        //             "min_market_funds": "1",
        //             "max_market_funds": "20000000",
        //             "margin_enabled": false,
        //             "fx_stablecoin": false,
        //             "max_slippage_percentage": "0.02000000",
        //             "post_only": false,
        //             "limit_only": false,
        //             "cancel_only": false,
        //             "trading_disabled": false,
        //             "status": "online",
        //             "status_message": '',
        //             "auction_mode": false
        //         }
        //     ]
        //
        const result = [];
        for (let i = 0; i < response.length; i++) {
            const market = response[i];
            const id = this.safeString(market, 'id');
            const [baseId, quoteId] = id.split('-');
            // BTCAUCTION-USD vs BTC-USD conflict workaround, see the output sample above
            // const baseId = this.safeString (market, 'base_currency');
            // const quoteId = this.safeString (market, 'quote_currency');
            const base = this.safeCurrencyCode(baseId);
            const quote = this.safeCurrencyCode(quoteId);
            const status = this.safeString(market, 'status');
            result.push(this.extend(this.fees['trading'], {
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
                'margin': this.safeValue(market, 'margin_enabled'),
                'swap': false,
                'future': false,
                'option': false,
                'active': (status === 'online'),
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.safeNumber(market, 'base_increment'),
                    'price': this.safeNumber(market, 'quote_increment'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': this.safeNumber(market, 'min_market_funds'),
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': market,
            }));
        }
        return result;
    }
    /**
     * @method
     * @name coinbaseexchange#fetchAccounts
     * @description fetch all the accounts associated with a profile
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getaccounts
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [account structures]{@link https://docs.ccxt.com/#/?id=account-structure} indexed by the account type
     */
    async fetchAccounts(params = {}) {
        await this.loadMarkets();
        const response = await this.privateGetAccounts(params);
        //
        //     [
        //         {
        //             "id": "4aac9c60-cbda-4396-9da4-4aa71e95fba0",
        //             "currency": "BTC",
        //             "balance": "0.0000000000000000",
        //             "available": "0",
        //             "hold": "0.0000000000000000",
        //             "profile_id": "b709263e-f42a-4c7d-949a-a95c83d065da"
        //         },
        //         {
        //             "id": "f75fa69a-1ad1-4a80-bd61-ee7faa6135a3",
        //             "currency": "USDC",
        //             "balance": "0.0000000000000000",
        //             "available": "0",
        //             "hold": "0.0000000000000000",
        //             "profile_id": "b709263e-f42a-4c7d-949a-a95c83d065da"
        //         },
        //     ]
        //
        return this.parseAccounts(response, params);
    }
    parseAccount(account) {
        //
        //     {
        //         "id": "4aac9c60-cbda-4396-9da4-4aa71e95fba0",
        //         "currency": "BTC",
        //         "balance": "0.0000000000000000",
        //         "available": "0",
        //         "hold": "0.0000000000000000",
        //         "profile_id": "b709263e-f42a-4c7d-949a-a95c83d065da"
        //     }
        //
        const currencyId = this.safeString(account, 'currency');
        return {
            'id': this.safeString(account, 'id'),
            'type': undefined,
            'code': this.safeCurrencyCode(currencyId),
            'info': account,
        };
    }
    parseBalance(response) {
        const result = { 'info': response };
        for (let i = 0; i < response.length; i++) {
            const balance = response[i];
            const currencyId = this.safeString(balance, 'currency');
            const code = this.safeCurrencyCode(currencyId);
            const account = this.account();
            account['free'] = this.safeString(balance, 'available');
            account['used'] = this.safeString(balance, 'hold');
            account['total'] = this.safeString(balance, 'balance');
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getaccounts
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance(params = {}) {
        await this.loadMarkets();
        const response = await this.privateGetAccounts(params);
        return this.parseBalance(response);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchOrderBook
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductbook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        await this.loadMarkets();
        // level 1 - only the best bid and ask
        // level 2 - top 50 bids and asks (aggregated)
        // level 3 - full order book (non aggregated)
        const request = {
            'id': this.marketId(symbol),
            'level': 2, // 1 best bidask, 2 aggregated, 3 full
        };
        const response = await this.publicGetProductsIdBook(this.extend(request, params));
        //
        //     {
        //         "sequence":1924393896,
        //         "bids":[
        //             ["0.01825","24.34811287",2],
        //             ["0.01824","72.5463",3],
        //             ["0.01823","424.54298049",6],
        //         ],
        //         "asks":[
        //             ["0.01826","171.10414904",4],
        //             ["0.01827","22.60427028",1],
        //             ["0.01828","397.46018784",7],
        //         ]
        //     }
        //
        const orderbook = this.parseOrderBook(response, symbol);
        orderbook['nonce'] = this.safeInteger(response, 'sequence');
        return orderbook;
    }
    parseTicker(ticker, market = undefined) {
        //
        // fetchTickers
        //
        //      [
        //         1639472400, // timestamp
        //         4.26, // low
        //         4.38, // high
        //         4.35, // open
        //         4.27 // close
        //      ]
        //
        // fetchTicker
        //
        //     publicGetProductsIdTicker
        //
        //     {
        //         "trade_id":843439,
        //         "price":"0.997999",
        //         "size":"80.29769",
        //         "time":"2020-01-28T02:13:33.012523Z",
        //         "bid":"0.997094",
        //         "ask":"0.998",
        //         "volume":"1903188.03750000"
        //     }
        //
        //     publicGetProductsIdStats
        //
        //     {
        //         "open": "34.19000000",
        //         "high": "95.70000000",
        //         "low": "7.06000000",
        //         "volume": "2.41000000"
        //     }
        //
        let timestamp = undefined;
        let bid = undefined;
        let ask = undefined;
        let last = undefined;
        let high = undefined;
        let low = undefined;
        let open = undefined;
        let volume = undefined;
        const symbol = (market === undefined) ? undefined : market['symbol'];
        if (Array.isArray(ticker)) {
            last = this.safeString(ticker, 4);
            timestamp = this.milliseconds();
        }
        else {
            timestamp = this.parse8601(this.safeValue(ticker, 'time'));
            bid = this.safeString(ticker, 'bid');
            ask = this.safeString(ticker, 'ask');
            high = this.safeString(ticker, 'high');
            low = this.safeString(ticker, 'low');
            open = this.safeString(ticker, 'open');
            last = this.safeString2(ticker, 'price', 'last');
            volume = this.safeString(ticker, 'volume');
        }
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': undefined,
            'ask': ask,
            'askVolume': undefined,
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': volume,
            'quoteVolume': undefined,
            'info': ticker,
        }, market);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproduct
     * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        symbols = this.marketSymbols(symbols);
        const request = {};
        const response = await this.publicGetProductsSparkLines(this.extend(request, params));
        //
        //     {
        //         YYY-USD: [
        //             [
        //                 1639472400, // timestamp
        //                 4.26, // low
        //                 4.38, // high
        //                 4.35, // open
        //                 4.27 // close
        //             ],
        //             [
        //                 1639468800,
        //                 4.31,
        //                 4.45,
        //                 4.35,
        //                 4.35
        //             ],
        //         ]
        //     }
        //
        const result = {};
        const marketIds = Object.keys(response);
        const delimiter = '-';
        for (let i = 0; i < marketIds.length; i++) {
            const marketId = marketIds[i];
            const entry = this.safeValue(response, marketId, []);
            const first = this.safeValue(entry, 0, []);
            const market = this.safeMarket(marketId, undefined, delimiter);
            const symbol = market['symbol'];
            result[symbol] = this.parseTicker(first, market);
        }
        return this.filterByArrayTickers(result, 'symbol', symbols);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchTicker
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductticker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'id': market['id'],
        };
        // publicGetProductsIdTicker or publicGetProductsIdStats
        const method = this.safeString(this.options, 'fetchTickerMethod', 'publicGetProductsIdTicker');
        const response = await this[method](this.extend(request, params));
        //
        // publicGetProductsIdTicker
        //
        //     {
        //         "trade_id":843439,
        //         "price":"0.997999",
        //         "size":"80.29769",
        //         "time":"2020-01-28T02:13:33.012523Z",
        //         "bid":"0.997094",
        //         "ask":"0.998",
        //         "volume":"1903188.03750000"
        //     }
        //
        // publicGetProductsIdStats
        //
        //     {
        //         "open": "34.19000000",
        //         "high": "95.70000000",
        //         "low": "7.06000000",
        //         "volume": "2.41000000"
        //     }
        //
        return this.parseTicker(response, market);
    }
    parseTrade(trade, market = undefined) {
        //
        //     {
        //         "type": "match",
        //         "trade_id": 82047307,
        //         "maker_order_id": "0f358725-2134-435e-be11-753912a326e0",
        //         "taker_order_id": "252b7002-87a3-425c-ac73-f5b9e23f3caf",
        //         "order_id": "d50ec984-77a8-460a-b958-66f114b0de9b",
        //         "side": "sell",
        //         "size": "0.00513192",
        //         "price": "9314.78",
        //         "product_id": "BTC-USD",
        //         "profile_id": "6244401d-c078-40d9-b305-7ad3551bc3b0",
        //         "sequence": 12038915443,
        //         "time": "2020-01-31T20:03:41.158814Z"
        //         "created_at": "2014-11-07T22:19:28.578544Z",
        //         "liquidity": "T",
        //         "fee": "0.00025",
        //         "settled": true,
        //         "usd_volume": "0.0924556000000000",
        //         "user_id": "595eb864313c2b02ddf2937d"
        //     }
        //
        const timestamp = this.parse8601(this.safeString2(trade, 'time', 'created_at'));
        const marketId = this.safeString(trade, 'product_id');
        market = this.safeMarket(marketId, market, '-');
        let feeRate = undefined;
        let takerOrMaker = undefined;
        let cost = undefined;
        const feeCurrencyId = this.safeStringLower(market, 'quoteId');
        if (feeCurrencyId !== undefined) {
            const costField = feeCurrencyId + '_value';
            cost = this.safeString(trade, costField);
            const liquidity = this.safeString(trade, 'liquidity');
            if (liquidity !== undefined) {
                takerOrMaker = (liquidity === 'T') ? 'taker' : 'maker';
                feeRate = this.safeString(market, takerOrMaker);
            }
        }
        const feeCost = this.safeString2(trade, 'fill_fees', 'fee');
        const fee = {
            'cost': feeCost,
            'currency': market['quote'],
            'rate': feeRate,
        };
        const id = this.safeString(trade, 'trade_id');
        let side = (trade['side'] === 'buy') ? 'sell' : 'buy';
        const orderId = this.safeString(trade, 'order_id');
        // Coinbase Pro returns inverted side to fetchMyTrades vs fetchTrades
        const makerOrderId = this.safeString(trade, 'maker_order_id');
        const takerOrderId = this.safeString(trade, 'taker_order_id');
        if ((orderId !== undefined) || ((makerOrderId !== undefined) && (takerOrderId !== undefined))) {
            side = (trade['side'] === 'buy') ? 'buy' : 'sell';
        }
        const price = this.safeString(trade, 'price');
        const amount = this.safeString(trade, 'size');
        return this.safeTrade({
            'id': id,
            'order': orderId,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'takerOrMaker': takerOrMaker,
            'side': side,
            'price': price,
            'amount': amount,
            'fee': fee,
            'cost': cost,
        }, market);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchMyTrades
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getfills
     * @description fetch all trades made by the user
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch trades for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchMyTrades() requires a symbol argument');
        }
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchMyTrades', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic('fetchMyTrades', symbol, since, limit, params, 100);
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'product_id': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['start_date'] = this.iso8601(since);
        }
        const until = this.safeValue2(params, 'until', 'end_date');
        if (until !== undefined) {
            params = this.omit(params, ['until']);
            request['end_date'] = this.iso8601(until);
        }
        const response = await this.privateGetFills(this.extend(request, params));
        return this.parseTrades(response, market, since, limit);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchTrades
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproducttrades
     * @description get the list of most recent trades for a particular symbol
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'id': market['id'], // fixes issue #2
        };
        if (limit !== undefined) {
            request['limit'] = limit; // default 100
        }
        const response = await this.publicGetProductsIdTrades(this.extend(request, params));
        //
        //    [
        //        {
        //            "trade_id": "15035219",
        //            "side": "sell",
        //            "size": "0.27426731",
        //            "price": "25820.42000000",
        //            "time": "2023-09-10T13:47:41.447577Z"
        //        },
        //    ]
        //
        return this.parseTrades(response, market, since, limit);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchTradingFees
     * @description fetch the trading fees for multiple markets
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getfees
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [fee structures]{@link https://docs.ccxt.com/#/?id=fee-structure} indexed by market symbols
     */
    async fetchTradingFees(params = {}) {
        await this.loadMarkets();
        const response = await this.privateGetFees(params);
        //
        //    {
        //        "maker_fee_rate": "0.0050",
        //        "taker_fee_rate": "0.0050",
        //        "usd_volume": "43806.92"
        //    }
        //
        const maker = this.safeNumber(response, 'maker_fee_rate');
        const taker = this.safeNumber(response, 'taker_fee_rate');
        const result = {};
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            result[symbol] = {
                'info': response,
                'symbol': symbol,
                'maker': maker,
                'taker': taker,
                'percentage': true,
                'tierBased': true,
            };
        }
        return result;
    }
    parseOHLCV(ohlcv, market = undefined) {
        //
        //     [
        //         1591514160,
        //         0.02507,
        //         0.02507,
        //         0.02507,
        //         0.02507,
        //         0.02816506
        //     ]
        //
        return [
            this.safeTimestamp(ohlcv, 0),
            this.safeNumber(ohlcv, 3),
            this.safeNumber(ohlcv, 2),
            this.safeNumber(ohlcv, 1),
            this.safeNumber(ohlcv, 4),
            this.safeNumber(ohlcv, 5),
        ];
    }
    /**
     * @method
     * @name coinbaseexchange#fetchOHLCV
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductcandles
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch trades for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchOHLCV', 'paginate', false);
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic('fetchOHLCV', symbol, since, limit, timeframe, params, 300);
        }
        const market = this.market(symbol);
        const parsedTimeframe = this.safeInteger(this.timeframes, timeframe);
        const request = {
            'id': market['id'],
        };
        if (parsedTimeframe !== undefined) {
            request['granularity'] = parsedTimeframe;
        }
        else {
            request['granularity'] = timeframe;
        }
        const until = this.safeValue2(params, 'until', 'end');
        params = this.omit(params, ['until']);
        if (since !== undefined) {
            request['start'] = this.iso8601(since);
            if (limit === undefined) {
                // https://docs.pro.coinbase.com/#get-historic-rates
                limit = 300; // max = 300
            }
            else {
                limit = Math.min(300, limit);
            }
            if (until === undefined) {
                const parsedTimeframeMilliseconds = parsedTimeframe * 1000;
                if (this.isRoundNumber(since % parsedTimeframeMilliseconds)) {
                    request['end'] = this.iso8601(this.sum((limit - 1) * parsedTimeframeMilliseconds, since));
                }
                else {
                    request['end'] = this.iso8601(this.sum(limit * parsedTimeframeMilliseconds, since));
                }
            }
            else {
                request['end'] = this.iso8601(until);
            }
        }
        const response = await this.publicGetProductsIdCandles(this.extend(request, params));
        //
        //     [
        //         [1591514160,0.02507,0.02507,0.02507,0.02507,0.02816506],
        //         [1591514100,0.02507,0.02507,0.02507,0.02507,1.63830323],
        //         [1591514040,0.02505,0.02507,0.02505,0.02507,0.19918178]
        //     ]
        //
        return this.parseOHLCVs(response, market, timeframe, since, limit);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchTime
     * @description fetches the current integer timestamp in milliseconds from the exchange server
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {int} the current integer timestamp in milliseconds from the exchange server
     */
    async fetchTime(params = {}) {
        const response = await this.publicGetTime(params);
        //
        //     {
        //         "iso":"2020-05-12T08:00:51.504Z",
        //         "epoch":1589270451.504
        //     }
        //
        return this.safeTimestamp(response, 'epoch');
    }
    parseOrderStatus(status) {
        const statuses = {
            'pending': 'open',
            'active': 'open',
            'open': 'open',
            'done': 'closed',
            'canceled': 'canceled',
            'canceling': 'open',
        };
        return this.safeString(statuses, status, status);
    }
    parseOrder(order, market = undefined) {
        //
        // createOrder
        //
        //     {
        //         "id": "d0c5340b-6d6c-49d9-b567-48c4bfca13d2",
        //         "price": "0.10000000",
        //         "size": "0.01000000",
        //         "product_id": "BTC-USD",
        //         "side": "buy",
        //         "stp": "dc",
        //         "type": "limit",
        //         "time_in_force": "GTC",
        //         "post_only": false,
        //         "created_at": "2016-12-08T20:02:28.53864Z",
        //         "fill_fees": "0.0000000000000000",
        //         "filled_size": "0.00000000",
        //         "executed_value": "0.0000000000000000",
        //         "status": "pending",
        //         "settled": false
        //     }
        //
        const timestamp = this.parse8601(this.safeString(order, 'created_at'));
        const marketId = this.safeString(order, 'product_id');
        market = this.safeMarket(marketId, market, '-');
        let status = this.parseOrderStatus(this.safeString(order, 'status'));
        const doneReason = this.safeString(order, 'done_reason');
        if ((status === 'closed') && (doneReason === 'canceled')) {
            status = 'canceled';
        }
        const price = this.safeString(order, 'price');
        const filled = this.safeString(order, 'filled_size');
        const amount = this.safeString(order, 'size', filled);
        const cost = this.safeString(order, 'executed_value');
        const feeCost = this.safeNumber(order, 'fill_fees');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = {
                'cost': feeCost,
                'currency': market['quote'],
                'rate': undefined,
            };
        }
        const id = this.safeString(order, 'id');
        const type = this.safeString(order, 'type');
        const side = this.safeString(order, 'side');
        const timeInForce = this.safeString(order, 'time_in_force');
        const postOnly = this.safeValue(order, 'post_only');
        const triggerPrice = this.safeNumber(order, 'stop_price');
        const clientOrderId = this.safeString(order, 'client_oid');
        return this.safeOrder({
            'id': id,
            'clientOrderId': clientOrderId,
            'info': order,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'lastTradeTimestamp': undefined,
            'status': status,
            'symbol': market['symbol'],
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': postOnly,
            'side': side,
            'price': price,
            'triggerPrice': triggerPrice,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': undefined,
            'fee': fee,
            'average': undefined,
            'trades': undefined,
        }, market);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchOrder
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getorder
     * @description fetches information on an order made by the user
     * @param {string} id the order id
     * @param {string} symbol not used by coinbaseexchange fetchOrder
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrder(id, symbol = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        const clientOrderId = this.safeString2(params, 'clientOrderId', 'client_oid');
        let method = undefined;
        if (clientOrderId === undefined) {
            method = 'privateGetOrdersId';
            request['id'] = id;
        }
        else {
            method = 'privateGetOrdersClientClientOid';
            request['client_oid'] = clientOrderId;
            params = this.omit(params, ['clientOrderId', 'client_oid']);
        }
        const response = await this[method](this.extend(request, params));
        return this.parseOrder(response);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchOrderTrades
     * @description fetch all the trades made from a single order
     * @param {string} id order id
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchOrderTrades(id, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
        }
        const request = {
            'order_id': id,
        };
        const response = await this.privateGetFills(this.extend(request, params));
        return this.parseTrades(response, market, since, limit);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchOrders
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getorders
     * @description fetches information on multiple orders made by the user
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch open orders for
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        const request = {
            'status': 'all',
        };
        return await this.fetchOpenOrders(symbol, since, limit, this.extend(request, params));
    }
    /**
     * @method
     * @name coinbaseexchange#fetchOpenOrders
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getorders
     * @description fetch all unfilled currently open orders
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of  open orders structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch open orders for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchOpenOrders', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic('fetchOpenOrders', symbol, since, limit, params, 100);
        }
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['product_id'] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100
        }
        if (since !== undefined) {
            request['start_date'] = this.iso8601(since);
        }
        const until = this.safeValue2(params, 'until', 'end_date');
        if (until !== undefined) {
            params = this.omit(params, ['until']);
            request['end_date'] = this.iso8601(until);
        }
        const response = await this.privateGetOrders(this.extend(request, params));
        return this.parseOrders(response, market, since, limit);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchClosedOrders
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getorders
     * @description fetches information on multiple closed orders made by the user
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch open orders for
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        const request = {
            'status': 'done',
        };
        return await this.fetchOpenOrders(symbol, since, limit, this.extend(request, params));
    }
    /**
     * @method
     * @name coinbaseexchange#createOrder
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_postorders
     * @description create a trade order
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
            // common params --------------------------------------------------
            // 'client_oid': clientOrderId,
            'type': type,
            'side': side,
            'product_id': market['id'],
            // 'size': this.amountToPrecision (symbol, amount),
            // 'stp': 'dc', // self-trade prevention, dc = decrease and cancel, co = cancel oldest, cn = cancel newest, cb = cancel both
            // 'stop': 'loss', // "loss" = stop loss below price, "entry" = take profit above price
            // 'stop_price': this.priceToPrecision (symbol, price),
            // limit order params ---------------------------------------------
            // 'price': this.priceToPrecision (symbol, price),
            // 'size': this.amountToPrecision (symbol, amount),
            // 'time_in_force': 'GTC', // GTC, GTT, IOC, or FOK
            // 'cancel_after' [optional]* min, hour, day, requires time_in_force to be GTT
            // 'post_only': false, // invalid when time_in_force is IOC or FOK
            // market order params --------------------------------------------
            // 'size': this.amountToPrecision (symbol, amount),
            // 'funds': this.costToPrecision (symbol, amount),
        };
        const clientOrderId = this.safeString2(params, 'clientOrderId', 'client_oid');
        if (clientOrderId !== undefined) {
            request['client_oid'] = clientOrderId;
        }
        const triggerPrice = this.safeNumberN(params, ['stopPrice', 'stop_price', 'triggerPrice']);
        if (triggerPrice !== undefined) {
            request['stop_price'] = this.priceToPrecision(symbol, triggerPrice);
        }
        const timeInForce = this.safeString2(params, 'timeInForce', 'time_in_force');
        if (timeInForce !== undefined) {
            request['time_in_force'] = timeInForce;
        }
        const postOnly = this.safeValue2(params, 'postOnly', 'post_only', false);
        if (postOnly) {
            request['post_only'] = true;
        }
        params = this.omit(params, ['timeInForce', 'time_in_force', 'stopPrice', 'stop_price', 'clientOrderId', 'client_oid', 'postOnly', 'post_only', 'triggerPrice']);
        if (type === 'limit') {
            request['price'] = this.priceToPrecision(symbol, price);
            request['size'] = this.amountToPrecision(symbol, amount);
        }
        else if (type === 'market') {
            let cost = this.safeNumber2(params, 'cost', 'funds');
            if (cost === undefined) {
                if (price !== undefined) {
                    cost = amount * price;
                }
            }
            else {
                params = this.omit(params, ['cost', 'funds']);
            }
            if (cost !== undefined) {
                request['funds'] = this.costToPrecision(symbol, cost);
            }
            else {
                request['size'] = this.amountToPrecision(symbol, amount);
            }
        }
        const response = await this.privatePostOrders(this.extend(request, params));
        //
        //     {
        //         "id": "d0c5340b-6d6c-49d9-b567-48c4bfca13d2",
        //         "price": "0.10000000",
        //         "size": "0.01000000",
        //         "product_id": "BTC-USD",
        //         "side": "buy",
        //         "stp": "dc",
        //         "type": "limit",
        //         "time_in_force": "GTC",
        //         "post_only": false,
        //         "created_at": "2016-12-08T20:02:28.53864Z",
        //         "fill_fees": "0.0000000000000000",
        //         "filled_size": "0.00000000",
        //         "executed_value": "0.0000000000000000",
        //         "status": "pending",
        //         "settled": false
        //     }
        //
        return this.parseOrder(response, market);
    }
    /**
     * @method
     * @name coinbaseexchange#cancelOrder
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_deleteorder
     * @description cancels an open order
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder(id, symbol = undefined, params = {}) {
        await this.loadMarkets();
        const request = {
        // 'product_id': market['id'], // the request will be more performant if you include it
        };
        const clientOrderId = this.safeString2(params, 'clientOrderId', 'client_oid');
        let method = undefined;
        if (clientOrderId === undefined) {
            method = 'privateDeleteOrdersId';
            request['id'] = id;
        }
        else {
            method = 'privateDeleteOrdersClientClientOid';
            request['client_oid'] = clientOrderId;
            params = this.omit(params, ['clientOrderId', 'client_oid']);
        }
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['product_id'] = market['symbol']; // the request will be more performant if you include it
        }
        const response = await this[method](this.extend(request, params));
        return this.safeOrder({ 'info': response });
    }
    /**
     * @method
     * @name coinbaseexchange#cancelAllOrders
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_deleteorders
     * @description cancel all open orders
     * @param {string} symbol unified market symbol, only orders in the market of this symbol are cancelled when symbol is not undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelAllOrders(symbol = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['product_id'] = market['symbol']; // the request will be more performant if you include it
        }
        const response = await this.privateDeleteOrders(this.extend(request, params));
        return [this.safeOrder({ 'info': response })];
    }
    async fetchPaymentMethods(params = {}) {
        return await this.privateGetPaymentMethods(params);
    }
    /**
     * @method
     * @name coinbaseexchange#withdraw
     * @description make a withdrawal
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_postwithdrawpaymentmethod
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_postwithdrawcoinbaseaccount
     * @param {string} code unified currency code
     * @param {float} amount the amount to withdraw
     * @param {string} address the address to withdraw to
     * @param {string} tag
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async withdraw(code, amount, address, tag = undefined, params = {}) {
        [tag, params] = this.handleWithdrawTagAndParams(tag, params);
        this.checkAddress(address);
        await this.loadMarkets();
        const currency = this.currency(code);
        const request = {
            'currency': currency['id'],
            'amount': amount,
        };
        let method = 'privatePostWithdrawals';
        if ('payment_method_id' in params) {
            method += 'PaymentMethod';
        }
        else if ('coinbase_account_id' in params) {
            method += 'CoinbaseAccount';
        }
        else {
            method += 'Crypto';
            request['crypto_address'] = address;
            if (tag !== undefined) {
                request['destination_tag'] = tag;
            }
        }
        const response = await this[method](this.extend(request, params));
        if (!response) {
            throw new errors.ExchangeError(this.id + ' withdraw() error: ' + this.json(response));
        }
        return this.parseTransaction(response, currency);
    }
    parseLedgerEntryType(type) {
        const types = {
            'transfer': 'transfer',
            'match': 'trade',
            'fee': 'fee',
            'rebate': 'rebate',
            'conversion': 'trade', // Funds converted between fiat currency and a stablecoin
        };
        return this.safeString(types, type, type);
    }
    parseLedgerEntry(item, currency = undefined) {
        //  {
        //      "id": "12087495079",
        //      "amount": "-0.0100000000000000",
        //      "balance": "0.0645419900000000",
        //      "created_at": "2021-10-28T17:14:32.593168Z",
        //      "type": "transfer",
        //      "details": {
        //          "from": "2f74edf7-1440-4586-86dc-ae58c5693691",
        //          "profile_transfer_id": "3ef093ad-2482-40d1-8ede-2f89cff5099e",
        //          "to": "dda99503-4980-4b60-9549-0b770ee51336"
        //      }
        //  },
        //  {
        //     "id": "11740725774",
        //     "amount": "-1.7565669701255000",
        //     "balance": "0.0016490047745000",
        //     "created_at": "2021-10-22T03:47:34.764122Z",
        //     "type": "fee",
        //     "details": {
        //         "order_id": "ad06abf4-95ab-432a-a1d8-059ef572e296",
        //         "product_id": "ETH-DAI",
        //         "trade_id": "1740617"
        //     }
        //  }
        const id = this.safeString(item, 'id');
        let amountString = this.safeString(item, 'amount');
        let direction = undefined;
        const afterString = this.safeString(item, 'balance');
        const beforeString = Precise["default"].stringSub(afterString, amountString);
        if (Precise["default"].stringLt(amountString, '0')) {
            direction = 'out';
            amountString = Precise["default"].stringAbs(amountString);
        }
        else {
            direction = 'in';
        }
        const amount = this.parseNumber(amountString);
        const after = this.parseNumber(afterString);
        const before = this.parseNumber(beforeString);
        const timestamp = this.parse8601(this.safeValue(item, 'created_at'));
        const type = this.parseLedgerEntryType(this.safeString(item, 'type'));
        const code = this.safeCurrencyCode(undefined, currency);
        const details = this.safeValue(item, 'details', {});
        let account = undefined;
        let referenceAccount = undefined;
        let referenceId = undefined;
        if (type === 'transfer') {
            account = this.safeString(details, 'from');
            referenceAccount = this.safeString(details, 'to');
            referenceId = this.safeString(details, 'profile_transfer_id');
        }
        else {
            referenceId = this.safeString(details, 'order_id');
        }
        const status = 'ok';
        return this.safeLedgerEntry({
            'info': item,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'direction': direction,
            'account': account,
            'referenceAccount': referenceAccount,
            'referenceId': referenceId,
            'type': type,
            'currency': code,
            'amount': amount,
            'before': before,
            'after': after,
            'status': status,
            'fee': undefined,
        }, currency);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchLedger
     * @description fetch the history of changes, actions done by the user or operations that altered the balance of the user
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getaccountledger
     * @param {string} code unified currency code, default is undefined
     * @param {int} [since] timestamp in ms of the earliest ledger entry, default is undefined
     * @param {int} [limit] max number of ledger entries to return, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch trades for
     * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/#/?id=ledger}
     */
    async fetchLedger(code = undefined, since = undefined, limit = undefined, params = {}) {
        // https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getaccountledger
        if (code === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchLedger() requires a code param');
        }
        await this.loadMarkets();
        await this.loadAccounts();
        const currency = this.currency(code);
        const accountsByCurrencyCode = this.indexBy(this.accounts, 'code');
        const account = this.safeValue(accountsByCurrencyCode, code);
        if (account === undefined) {
            throw new errors.ExchangeError(this.id + ' fetchLedger() could not find account id for ' + code);
        }
        const request = {
            'id': account['id'],
            // 'start_date': this.iso8601 (since),
            // 'end_date': this.iso8601 (this.milliseconds ()),
            // 'before': 'cursor', // sets start cursor to before date
            // 'after': 'cursor', // sets end cursor to after date
            // 'limit': limit, // default 100
            // 'profile_id': 'string'
        };
        if (since !== undefined) {
            request['start_date'] = this.iso8601(since);
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100
        }
        const until = this.safeValue2(params, 'until', 'end_date');
        if (until !== undefined) {
            params = this.omit(params, ['until']);
            request['end_date'] = this.iso8601(until);
        }
        const response = await this.privateGetAccountsIdLedger(this.extend(request, params));
        for (let i = 0; i < response.length; i++) {
            response[i]['currency'] = code;
        }
        return this.parseLedger(response, currency, since, limit);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchDepositsWithdrawals
     * @description fetch history of deposits and withdrawals
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_gettransfers
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getaccounttransfers
     * @param {string} [code] unified currency code for the currency of the deposit/withdrawals, default is undefined
     * @param {int} [since] timestamp in ms of the earliest deposit/withdrawal, default is undefined
     * @param {int} [limit] max number of deposit/withdrawals to return, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.id] account id, when defined, the endpoint used is '/accounts/{account_id}/transfers/' instead of '/transfers/'
     * @returns {object} a list of [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDepositsWithdrawals(code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        await this.loadAccounts();
        let currency = undefined;
        let id = this.safeString(params, 'id'); // account id
        if (id === undefined) {
            if (code !== undefined) {
                currency = this.currency(code);
                const accountsByCurrencyCode = this.indexBy(this.accounts, 'code');
                const account = this.safeValue(accountsByCurrencyCode, code);
                if (account === undefined) {
                    throw new errors.ExchangeError(this.id + ' fetchDepositsWithdrawals() could not find account id for ' + code);
                }
                id = account['id'];
            }
        }
        const request = {};
        if (id !== undefined) {
            request['id'] = id;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let response = undefined;
        if (id === undefined) {
            response = await this.privateGetTransfers(this.extend(request, params));
            //
            //    [
            //        {
            //            "id": "bee6fd7c-afb2-4e47-8298-671d09997d16",
            //            "type": "deposit",
            //            "created_at": "2022-12-21 00:48:45.477503+00",
            //            "completed_at": null,
            //            "account_id": "sal3802-36bd-46be-a7b8-alsjf383sldak",
            //            "user_id": "6382048209f92as392039dlks2",
            //            "amount": "0.01000000",
            //            "details": {
            //                "network": "litecoin",
            //                "crypto_address": "MKemtnCFUYKsNWaf5EMYMpwSszcXWFDtTY",
            //                "coinbase_account_id": "fl2b6925-f6ba-403n-jj03-40fl435n430f",
            //                "coinbase_transaction_id": "63a25bb13cb5cf0001d2cf17", // withdrawals only
            //                "crypto_transaction_hash": "752f35570736341e2a253f7041a34cf1e196fc56128c900fd03d99da899d94c1",
            //                "tx_service_transaction_id": "1873249104",
            //                "coinbase_payment_method_id": ""
            //            },
            //            "canceled_at": null,
            //            "processed_at": null,
            //            "user_nonce": null,
            //            "idem": "5e3201b0-e390-5k3k-a913-c32932049242",
            //            "profile_id": "k3k302a8-c4dk-4f49-9d39-3203923wpk39",
            //            "currency": "LTC"
            //        }
            //    ]
            //
            for (let i = 0; i < response.length; i++) {
                const account_id = this.safeString(response[i], 'account_id');
                const account = this.safeValue(this.accountsById, account_id);
                const codeInner = this.safeString(account, 'code');
                response[i]['currency'] = codeInner;
            }
        }
        else {
            response = await this.privateGetAccountsIdTransfers(this.extend(request, params));
            //
            //    [
            //        {
            //            "id": "bee6fd7c-afb2-4e47-8298-671d09997d16",
            //            "type": "deposit",
            //            "created_at": "2022-12-21 00:48:45.477503+00",
            //            "completed_at": null,
            //            "amount": "0.01000000",
            //            "details": {
            //                "network": "litecoin",
            //                "crypto_address": "MKemtnCFUYKsNWaf5EMYMpwSszcXWFDtTY",
            //                "coinbase_account_id": "fl2b6925-f6ba-403n-jj03-40fl435n430f",
            //                "coinbase_transaction_id": "63a25bb13cb5cf0001d2cf17", // withdrawals only
            //                "crypto_transaction_hash": "752f35570736341e2a253f7041a34cf1e196fc56128c900fd03d99da899d94c1",
            //                "tx_service_transaction_id": "1873249104",
            //                "coinbase_payment_method_id": ""
            //            },
            //            "canceled_at": null,
            //            "processed_at": null,
            //            "user_nonce": null,
            //            "idem": "5e3201b0-e390-5k3k-a913-c32932049242",
            //            "profile_id": "k3k302a8-c4dk-4f49-9d39-3203923wpk39",
            //            "currency": "LTC"
            //        }
            //    ]
            //
            for (let i = 0; i < response.length; i++) {
                response[i]['currency'] = code;
            }
        }
        return this.parseTransactions(response, currency, since, limit);
    }
    /**
     * @method
     * @name coinbaseexchange#fetchDeposits
     * @description fetch all deposits made to an account
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_gettransfers
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getaccounttransfers
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch deposits for
     * @param {int} [limit] the maximum number of deposits structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDeposits(code = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchDepositsWithdrawals(code, since, limit, this.extend({ 'type': 'deposit' }, params));
    }
    /**
     * @method
     * @name coinbaseexchange#fetchWithdrawals
     * @description fetch all withdrawals made from an account
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_gettransfers
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getaccounttransfers
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch withdrawals for
     * @param {int} [limit] the maximum number of withdrawals structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchWithdrawals(code = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchDepositsWithdrawals(code, since, limit, this.extend({ 'type': 'withdraw' }, params));
    }
    parseTransactionStatus(transaction) {
        const canceled = this.safeValue(transaction, 'canceled_at');
        if (canceled) {
            return 'canceled';
        }
        const processed = this.safeValue(transaction, 'processed_at');
        const completed = this.safeValue(transaction, 'completed_at');
        if (completed) {
            return 'ok';
        }
        else if (processed && !completed) {
            return 'failed';
        }
        else {
            return 'pending';
        }
    }
    parseTransaction(transaction, currency = undefined) {
        //
        // privateGetTransfers
        //
        //    [
        //        {
        //            "id": "bee6fd7c-afb2-4e47-8298-671d09997d16",
        //            "type": "deposit",
        //            "created_at": "2022-12-21 00:48:45.477503+00",
        //            "completed_at": null,
        //            "account_id": "sal3802-36bd-46be-a7b8-alsjf383sldak",     // only from privateGetTransfers
        //            "user_id": "6382048209f92as392039dlks2",                  // only from privateGetTransfers
        //            "amount": "0.01000000",
        //            "details": {
        //                "network": "litecoin",
        //                "crypto_address": "MKemtnCFUYKsNWaf5EMYMpwSszcXWFDtTY",
        //                "coinbase_account_id": "fl2b6925-f6ba-403n-jj03-40fl435n430f",
        //                "coinbase_transaction_id": "63a25bb13cb5cf0001d2cf17", // withdrawals only
        //                "crypto_transaction_hash": "752f35570736341e2a253f7041a34cf1e196fc56128c900fd03d99da899d94c1",
        //                "tx_service_transaction_id": "1873249104",
        //                "coinbase_payment_method_id": ""
        //            },
        //            "canceled_at": null,
        //            "processed_at": null,
        //            "user_nonce": null,
        //            "idem": "5e3201b0-e390-5k3k-a913-c32932049242",
        //            "profile_id": "k3k302a8-c4dk-4f49-9d39-3203923wpk39",
        //            "currency": "LTC"
        //        }
        //    ]
        //
        const details = this.safeValue(transaction, 'details', {});
        const timestamp = this.parse8601(this.safeString(transaction, 'created_at'));
        const currencyId = this.safeString(transaction, 'currency');
        const code = this.safeCurrencyCode(currencyId, currency);
        let amount = this.safeNumber(transaction, 'amount');
        let type = this.safeString(transaction, 'type');
        let address = this.safeString(details, 'crypto_address');
        address = this.safeString(transaction, 'crypto_address', address);
        const fee = {
            'currency': undefined,
            'cost': undefined,
            'rate': undefined,
        };
        if (type === 'withdraw') {
            type = 'withdrawal';
            address = this.safeString(details, 'sent_to_address', address);
            const feeCost = this.safeNumber(details, 'fee');
            if (feeCost !== undefined) {
                if (amount !== undefined) {
                    amount -= feeCost;
                }
                fee['cost'] = feeCost;
                fee['currency'] = code;
            }
        }
        const networkId = this.safeString(details, 'network');
        return {
            'info': transaction,
            'id': this.safeString(transaction, 'id'),
            'txid': this.safeString(details, 'crypto_transaction_hash'),
            'type': type,
            'currency': code,
            'network': this.networkIdToCode(networkId),
            'amount': amount,
            'status': this.parseTransactionStatus(transaction),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'address': address,
            'addressFrom': undefined,
            'addressTo': this.safeString(details, 'crypto_address'),
            'tag': this.safeString(details, 'destination_tag'),
            'tagFrom': undefined,
            'tagTo': undefined,
            'updated': this.parse8601(this.safeString(transaction, 'processed_at')),
            'comment': undefined,
            'internal': false,
            'fee': fee,
        };
    }
    /**
     * @method
     * @name coinbaseexchange#createDepositAddress
     * @description create a currency deposit address
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_postcoinbaseaccountaddresses
     * @param {string} code unified currency code of the currency for the deposit address
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
     */
    async createDepositAddress(code, params = {}) {
        await this.loadMarkets();
        const currency = this.currency(code);
        let accounts = this.safeValue(this.options, 'coinbaseAccounts');
        if (accounts === undefined) {
            accounts = await this.privateGetCoinbaseAccounts();
            this.options['coinbaseAccounts'] = accounts; // cache it
            this.options['coinbaseAccountsByCurrencyId'] = this.indexBy(accounts, 'currency');
        }
        const currencyId = currency['id'];
        const account = this.safeValue(this.options['coinbaseAccountsByCurrencyId'], currencyId);
        if (account === undefined) {
            // eslint-disable-next-line quotes
            throw new errors.InvalidAddress(this.id + " createDepositAddress() could not find currency code " + code + " with id = " + currencyId + " in this.options['coinbaseAccountsByCurrencyId']");
        }
        const request = {
            'id': account['id'],
        };
        const response = await this.privatePostCoinbaseAccountsIdAddresses(this.extend(request, params));
        const address = this.safeString(response, 'address');
        const tag = this.safeString(response, 'destination_tag');
        return {
            'currency': code,
            'address': this.checkAddress(address),
            'network': undefined,
            'tag': tag,
            'info': response,
        };
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = '/' + this.implodeParams(path, params);
        const query = this.omit(params, this.extractParams(path));
        if (method === 'GET') {
            if (Object.keys(query).length) {
                request += '?' + this.urlencode(query);
            }
        }
        const url = this.implodeHostname(this.urls['api'][api]) + request;
        if (api === 'private') {
            this.checkRequiredCredentials();
            const nonce = this.nonce().toString();
            let payload = '';
            if (method !== 'GET') {
                if (Object.keys(query).length) {
                    body = this.json(query);
                    payload = body;
                }
            }
            const what = nonce + method + request + payload;
            let secret = undefined;
            try {
                secret = this.base64ToBinary(this.secret);
            }
            catch (e) {
                throw new errors.AuthenticationError(this.id + ' sign() invalid base64 secret');
            }
            const signature = this.hmac(this.encode(what), secret, sha256.sha256, 'base64');
            headers = {
                'CB-ACCESS-KEY': this.apiKey,
                'CB-ACCESS-SIGN': signature,
                'CB-ACCESS-TIMESTAMP': nonce,
                'CB-ACCESS-PASSPHRASE': this.password,
                'Content-Type': 'application/json',
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    handleErrors(code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if ((code === 400) || (code === 404)) {
            if (body[0] === '{') {
                const message = this.safeString(response, 'message');
                const feedback = this.id + ' ' + message;
                this.throwExactlyMatchedException(this.exceptions['exact'], message, feedback);
                this.throwBroadlyMatchedException(this.exceptions['broad'], message, feedback);
                throw new errors.ExchangeError(feedback); // unknown message
            }
            throw new errors.ExchangeError(this.id + ' ' + body);
        }
        return undefined;
    }
    async request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined, config = {}) {
        const response = await this.fetch2(path, api, method, params, headers, body, config);
        if (typeof response !== 'string') {
            if ('message' in response) {
                throw new errors.ExchangeError(this.id + ' ' + this.json(response));
            }
        }
        return response;
    }
}

module.exports = coinbaseexchange;
