axios = require('axios');

module.exports = {
  data: {
    tokens: [],
    ETH: [],
    addrs: localStorage.etherAddrs,
    lag: true,
    selected: -1,
    lastTrendData: [],
  },
  getAddressInfo: function(){
    if(!this.data.addrs) return 0;
    axios.get('https://api.ethplorer.io/getAddressInfo/' + this.data.addrs + '?apiKey=freekey')
    .then((response)=> {
      this.info = response.data;
      this.data.ETH = response.data.ETH;
      response.data.tokens.forEach((t)=>{
        this.data.tokens.push({
          name: t.tokenInfo.name,
          short: t.tokenInfo.symbol,
          address: t.tokenInfo.address,
          price: t.tokenInfo.price.rate,
          amount: t.balance/Math.pow(10,t.tokenInfo.decimals),
          balance: t.tokenInfo.price.rate * t.balance/Math.pow(10,t.tokenInfo.decimals),
          txs: [],
        })
      });
      this.updateAllPrices();
      this.getAddressHistory();
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  updateAllPrices: function(){
    console.log('Refresh Princes');
    axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
    .then((response)=> {
      this.data.ETH.price = response.data.USD;
      this.data.lag = false;
    })
    .catch(function (error) {
      console.log(error);
    });
    var tokens = this.data.tokens;
    var counter = 0;
    this.data.tokens.forEach((coin, index)=>{
      var temp = coin;
      var i = index;
      axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + coin.short + "&tsyms=USD,ETH")
      .then(function (response) {
        temp.price  = response.data.USD;
        temp.priceETH = response.data.ETH;
        temp.balance = temp.amount * temp.price;
        counter++;
        if(counter==tokens.length){
          tokens.sort(function(a, b) {
            return b.balance - a.balance;
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    });
    setTimeout(()=>{
      this.updateAllPrices();
    }, 10000);
  },
  getAddressHistory: function(){
    var addrs = this.data.addrs.toLowerCase();
    this.data.tokens.forEach((token)=>{
      var t = token;
      axios.get('https://api.ethplorer.io/getAddressHistory/' + this.data.addrs + '?apiKey=freekey&token=' + token.address)
      .then(function (response) {
        response.data.operations.forEach((h, i)=>{
          var temp = h;
          var index = i;
          axios.get('https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + t.short + '&tsyms=USD,ETH&ts=' + h.timestamp)
          .then(function (response) {
            //console.log(response, t)
            var price = response.data[t.short].USD;
            var priceETH = response.data[t.short].ETH;
            var value = temp.value / Math.pow(10, temp.tokenInfo.decimals);
            t.txs.push({price, priceETH, timestamp: temp.timestamp, amount: addrs == temp.to ? value : -value});
          })
          .catch(function (error) {
            console.log(error);
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    });
  }
};
