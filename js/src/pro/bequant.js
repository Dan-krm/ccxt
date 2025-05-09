//  ---------------------------------------------------------------------------
import hitbtc from './hitbtc.js';
import hitbtcRest from '../hitbtc.js';
import bequantRest from '../bequant.js';
// ---------------------------------------------------------------------------
export default class bequant extends hitbtc {
    describe() {
        // eslint-disable-next-line new-cap
        const describeExtended = this.getDescribeForExtendedWsExchange(new bequantRest(), new hitbtcRest(), super.describe());
        return this.deepExtend(describeExtended, {
            'id': 'bequant',
            'name': 'Bequant',
            'countries': ['MT'],
            'pro': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/55248342-a75dfe00-525a-11e9-8aa2-05e9dca943c6.jpg',
                'api': {
                    'public': 'https://api.bequant.io/api/3',
                    'private': 'https://api.bequant.io/api/3',
                    'ws': {
                        'public': 'wss://api.bequant.io/api/3/ws/public',
                        'private': 'wss://api.bequant.io/api/3/ws/trading',
                    },
                },
                'www': 'https://bequant.io',
                'doc': [
                    'https://api.bequant.io/',
                ],
                'fees': [
                    'https://bequant.io/fees-and-limits',
                ],
                'referral': 'https://bequant.io',
            },
        });
    }
}
