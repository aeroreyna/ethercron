<template lang="pug">
#LandingPage.container
  .row
    .col.s2
      h5 Address
    .col.s8
      input.center(type="text" v-model="addrs")
    .col.s2
      p.btn(v-on:click="getAddressInfo") Go
  .row
    .someDiv(v-if="info.ETH")
      h5 Total USD: ${{usmoney.toFixed(2)}}
      table
        tr
          th Name
          th Price Unit
          th Units
          th Total US
        tr
          th Ethereum
          th ${{(price.ETH).toFixed(2)}}
          th {{info.ETH.balance}}
          th ${{(price.ETH * info.ETH.balance).toFixed(2)}}
        tr(v-for="t in info.tokens" v-if="price[t.tokenInfo.symbol]")
          th
            b {{t.tokenInfo.name}}
          th ${{price[t.tokenInfo.symbol]}}
          th {{t.balance/Math.pow(10,t.tokenInfo.decimals)}}
          th ${{(t.balance/Math.pow(10,t.tokenInfo.decimals) * price[t.tokenInfo.symbol]).toFixed(2)}}
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  var getAddressInfo = function(addr, wallet){
    axios.get('https://api.ethplorer.io/getAddressInfo/' + addr + '?apiKey=freekey')
    .then(function (response) {
      //console.log(response);
      wallet.info = response.data;
      response.data.tokens.forEach((t)=>{
        wallet.$set(wallet.price, t.tokenInfo.symbol, t.tokenInfo.price.rate);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  var ethData = function(objData){
    axios.get('https://www.coincap.io/page/ETH')
    .then(function (response) {
      //console.log(response);
      objData.ETH = response.data;
      objData.$set(objData.price, "ETH", response.data.price_usd);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  var updateAllPrices = function(objData){
    console.log('Refresh Princes');
    Object.keys(objData.price).forEach((coin)=>{
      var temp = coin;
      axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + coin + "&tsyms=BTC,USD,EUR,ETH")
      .then(function (response) {
        console.log(response, temp);
        objData.price[temp]  = response.data.USD;
      })
      .catch(function (error) {
        console.log(error);
      });
    });
    setTimeout(()=>{
      updateAllPrices(objData);
    }, 10000);
  }

  export default {
    name: 'landing-page',
    data(){
      return {
        addrs: localStorage.etherAddrs ? localStorage.etherAddrs : "0x8d12a197cb00d4747a1fe03395095ce2a5cc6819",
        info: {},
        price: {},
      }
    },
    components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      getAddressInfo(){
        localStorage.etherAddrs = this.addrs;
        getAddressInfo(this.addrs, this);
        ethData(this);
        setTimeout(()=>{
          updateAllPrices(this);
        }, 30*1000);
      }
    },
    computed:{
      usmoney(){
        var count = 0;
        count += this.price["ETH"] * this.info.ETH.balance
        this.info.tokens.forEach((t)=>{
          if(this.price[t.tokenInfo.symbol]){
            count += t.balance/Math.pow(10,t.tokenInfo.decimals) * this.price[t.tokenInfo.symbol];
          }
        });
        return count;
      }
    },
  }
</script>

<style>

</style>
