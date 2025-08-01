'use strict';

var binance = require('./binance.js');
var errors = require('./base/errors.js');

// ----------------------------------------------------------------------------
//  ---------------------------------------------------------------------------
class binanceusdm extends binance {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'binanceusdm',
            'name': 'Binance USDⓈ-M',
            'urls': {
                'logo': 'https://github.com/user-attachments/assets/871cbea7-eebb-4b28-b260-c1c91df0487a',
                'doc': [
                    'https://binance-docs.github.io/apidocs/futures/en/',
                    'https://binance-docs.github.io/apidocs/spot/en',
                    'https://developers.binance.com/en',
                ],
            },
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': true,
                'future': true,
                'option': undefined,
                'createStopMarketOrder': true,
            },
            'options': {
                'fetchMarkets': {
                    'types': ['linear'],
                },
                'defaultSubType': 'linear',
                // https://www.binance.com/en/support/faq/360033162192
                // tier amount, maintenance margin, initial margin,
                'leverageBrackets': undefined,
                'marginTypes': {},
                'marginModes': {},
            },
            // https://binance-docs.github.io/apidocs/futures/en/#error-codes
            // https://developers.binance.com/docs/derivatives/usds-margined-futures/error-code
            'exceptions': {
                'exact': {
                    '-5021': errors.InvalidOrder,
                    '-5022': errors.InvalidOrder,
                    '-5028': errors.InvalidOrder, // {"code":-5028,"msg":"Timestamp for this request is outside of the ME recvWindow."}
                },
            },
        });
    }
    async transferIn(code, amount, params = {}) {
        // transfer from spot wallet to usdm futures wallet
        return await this.futuresTransfer(code, amount, 1, params);
    }
    async transferOut(code, amount, params = {}) {
        // transfer from usdm futures wallet to spot wallet
        return await this.futuresTransfer(code, amount, 2, params);
    }
}

module.exports = binanceusdm;
