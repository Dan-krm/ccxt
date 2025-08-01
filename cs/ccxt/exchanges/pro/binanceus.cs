namespace ccxt.pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


public partial class binanceus { public binanceus(object args = null) : base(args) { } }
public partial class binanceus : binance
{
    public override object describe()
    {
        // eslint-disable-next-line new-cap
        var restInstance = new ccxt.binanceus();
        object restDescribe = restInstance.describe();
        object parentWsDescribe = base.describeData();
        object extended = this.deepExtend(restDescribe, parentWsDescribe);
        return this.deepExtend(extended, new Dictionary<string, object>() {
            { "id", "binanceus" },
            { "name", "Binance US" },
            { "countries", new List<object>() {"US"} },
            { "certified", false },
            { "urls", new Dictionary<string, object>() {
                { "logo", "https://user-images.githubusercontent.com/1294454/65177307-217b7c80-da5f-11e9-876e-0b748ba0a358.jpg" },
                { "api", new Dictionary<string, object>() {
                    { "ws", new Dictionary<string, object>() {
                        { "spot", "wss://stream.binance.us:9443/ws" },
                    } },
                    { "web", "https://www.binance.us" },
                    { "sapi", "https://api.binance.us/sapi/v1" },
                    { "wapi", "https://api.binance.us/wapi/v3" },
                    { "public", "https://api.binance.us/api/v3" },
                    { "private", "https://api.binance.us/api/v3" },
                    { "v3", "https://api.binance.us/api/v3" },
                    { "v1", "https://api.binance.us/api/v1" },
                } },
                { "www", "https://www.binance.us" },
                { "referral", "https://www.binance.us/?ref=35005074" },
                { "doc", "https://github.com/binance-us/binance-official-api-docs" },
                { "fees", "https://www.binance.us/en/fee/schedule" },
            } },
            { "options", new Dictionary<string, object>() {
                { "fetchCurrencies", false },
                { "quoteOrderQty", false },
                { "defaultType", "spot" },
                { "fetchMarkets", new Dictionary<string, object>() {
                    { "types", new List<object>() {"spot"} },
                } },
            } },
        });
    }
}
