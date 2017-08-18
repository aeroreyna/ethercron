<template lang="pug">
.token-history.container
  p(v-on:click="$router.go(-1)") <- Back
  h5 {{name}} - {{short}}
  .row
    table
      tr
        th Date
        th Units
        th Buy's Price
        th Price
        th Profit
      tr(v-for="h in history")
        th {{getDate(h.timestamp)}}
        th {{h.value/Math.pow(10,h.tokenInfo.decimals)}}
        th {{h.buyprice}}
        th {{price}}
        th {{(price - h.buyprice)*h.value/Math.pow(10,h.tokenInfo.decimals)}}

  graph
</template>

<script>
var getAddressHistory = function(wallet){
  console.log(wallet)
  axios.get('https://api.ethplorer.io/getAddressHistory/' + wallet.addrs + '?apiKey=freekey&token=' + wallet.tkAddrs)
  .then(function (response) {
    //console.log(response);
    // response.data.operations;
    response.data.operations.forEach((h, i)=>{
      var temp = h;
      var index = i;
      response.data.operations[index].buyprice = 1;
      axios.get('https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + wallet.short + '&tsyms=USD,ETH&ts=' + h.timestamp)
      .then(function (response) {
        wallet.history[index].buyprice = response.data[wallet.short].USD;
      })
      .catch(function (error) {
        console.log(error);
      });
    });
    wallet.history = response.data.operations;
  })
  .catch(function (error) {
    console.log(error);
  });
}

export default {
  name:"History",
  data(){
    return {
      name: "",
      short: "",
      tkAddrs: "",
      addrs: "",
      price: 0,
      history: {}
    }
  },
  methods:{
    getDate(seconds){
      var d = new Date(seconds*1000);
      //d.setSeconds(seconds);
      return d.toISOString().substring(0,19).replace("T", " ");
    }
  },
  mounted(){
    console.log(this.$route)
    this.short = this.$route.query.short;
    this.name = this.$route.query.name;
    this.tkAddrs = this.$route.query.tkAddrs;
    this.addrs = this.$route.query.addrs;
    this.price = this.$route.query.price;

    var short = this.short;
    getAddressHistory(this);

    var baseUrl = "https://widgets.cryptocompare.com/";
    //var embedder = document.getElementById("graphHistory");
    var scripts = document.getElementsByTagName("graph");
    var embedder = scripts[ scripts.length - 1 ];
    (function (){
      var appName = "etherctron";
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;//chart?fsym=PLR&tsym=USD'
      var theUrl = baseUrl+'serve/v2/coin/chart?fsym=' + short + '&tsym=ETH&period=1W';
      s.src = theUrl + ( theUrl.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;
      embedder.parentNode.appendChild(s);
    })();
  }
}

</script>

<style lang="css">
</style>
