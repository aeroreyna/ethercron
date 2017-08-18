<template lang="pug">
#LandingPage.container
  .row(v-if="!info.ETH")
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
        tr(v-for="t in info.tokens")
          th(v-on:click="$router.push({ name: 'History', query:{short: t.tokenInfo.symbol, name: t.tokenInfo.name, addrs, tkAddrs: t.tokenInfo.address, price: price[t.tokenInfo.symbol]} })")
            b {{t.tokenInfo.name}}
          th
            p(v-if="price[t.tokenInfo.symbol]") ${{price[t.tokenInfo.symbol]}}
          th {{t.balance/Math.pow(10,t.tokenInfo.decimals)}}
          th
            p(v-if="price[t.tokenInfo.symbol]") ${{(t.balance/Math.pow(10,t.tokenInfo.decimals) * price[t.tokenInfo.symbol]).toFixed(2)}}
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  var getAddressInfo = function(addr, wallet){
    //console.log(addr, wallet)
    axios.get('https://api.ethplorer.io/getAddressInfo/' + addr + '?apiKey=freekey')
    .then(function (response) {
      //console.log(response);
      wallet.info = response.data;
      response.data.tokens.forEach((t)=>{
        wallet.$set(wallet.price, t.tokenInfo.symbol, t.tokenInfo.price.rate);
      });
      updateAllPrices(wallet);
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
    localStorage.info = JSON.stringify(objData.info);
    localStorage.price = JSON.stringify(objData.price);
    Object.keys(objData.price).forEach((coin)=>{
      var temp = coin;
      axios.get("https://min-api.cryptocompare.com/data/price?fsym=" + coin + "&tsyms=BTC,USD,EUR,ETH")
      .then(function (response) {
        //console.log(response, temp);
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
        info: localStorage.info ? JSON.parse(localStorage.info) : {},
        price: localStorage.price ? JSON.parse(localStorage.price) : {},
      }
    },
    components: { SystemInformation },
    mounted(){
      if(localStorage.etherAddrs){
        console.log(this.addrs)
        this.getAddressInfo();
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      getAddressInfo(){
        localStorage.etherAddrs = this.addrs;
        getAddressInfo(this.addrs, this);
        //ethData(this);
        /*setTimeout(()=>{
          updateAllPrices(this);
        }, 30*1000);
        */
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
