import os
import sys

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.append(root)

# ----------------------------------------------------------------------------

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

# ----------------------------------------------------------------------------
# -*- coding: utf-8 -*-

import ccxt  # noqa: F402

def test_parse_precision():
    exchange = ccxt.Exchange({
        'id': 'sampleexchange',
    })
    assert exchange.parse_precision('15') == '0.000000000000001'
    assert exchange.parse_precision('1') == '0.1'
    assert exchange.parse_precision('0') == '1'
    assert exchange.parse_precision('-5') == '100000'
