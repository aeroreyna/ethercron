<template lang="pug">
#LandingPage.container
  .row(v-if="!addrs || lag")
    .col.s2
      h5 Address
    .col.s8
      input.center(type="text" v-model="addrs")
    .col.s2
      p.btn(v-on:click="getAddressInfoL") Go
  .row
    .someDiv(v-if="ETH && !lag")
      #balance-general.center
        h4 Balance: ${{usmoney().toFixed(2)}}
        h5
          small {{ETH.totalIn}} - {{ETH.totalOut}}
      .row#tokens
        .col.s12.ether
          .col.s9
            h5 Ether
            h5
              small {{ETH.balance}}
          .col.s3
            h5.right-align ${{(ETH.balance * ETH.price).toFixed(2)}}
            p.right-align {{ETH.price.toFixed(2)}}
        .col.s12.m6.tocken(v-if="tokens" v-for="(t, i) in tokens" v-on:click="selected = selected!=i ? i:-1; getHistoricPrice();" v-bind:class="{active:selected==i}")
          .col.s7
            h5 {{t.name}}
            h5
              small {{t.amount}}
          .col.s5
            h5.right-align ${{t.balance.toFixed(2)}}
            p.right-align {{t.price}} USD
            p.right-align {{t.priceETH}} ETH
          .col.s12(v-if="t.txs && selected == i ")
            .col.s6.center
              p Invest
              h5 {{sumTx(t.txs).toFixed(2)}}
            .col.s5.center
              p Profit
              h5 {{(t.balance - sumTx(t.txs)).toFixed(2)}}
            .col.s12(v-if="lastTrendData.length > 0")
              Trend(:data="lastTrendData", :gradient="['#6fa8dc', '#42b983', '#2c3e50']",  auto-draw, smooth)
</template>

<script>
  import Trend from 'vuetrend';
  export default {
    name: 'landing-page',
    data(){
      return api.data
    },
    components:{
      Trend
    },
    mounted(){
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      getHistoricPrice(){
        if(this.selected == -1) return 0;
        var coin = this.tokens[this.selected].short;
        this.lastTrendData = [];
        axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=' + coin + '&tsym=USD&limit=60')
        .then((response)=>{
          var arr = response.data.Data.map((i)=>{
            return i.close * 100;
          });
          this.lastTrendData = arr;
        })
        .catch(function(err){
          console.log(err);
        });
      },
      getAddressInfoL(){
        localStorage.etherAddrs = this.addrs;
        api.getAddressInfo();
      },
      usmoney(){
        var count = 0;
        count += this.ETH.price * this.ETH.balance
        this.tokens.forEach((t)=>{
          if(t.price){
            count += t.balance;
          }
        });
        return count;
      },
      sumTx(txs){
        var sum = 0;
        txs.forEach((tx)=>{
          sum += tx.price * tx.amount;
        })
        return sum
      }
    },
    computed:{

    },
  }
</script>

<style>
#LandingPage{
}
.tocken{
  transition: all 0.2s;
}
.tocken:hover{
}
.active{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.2s;
  background-color: white;
  position: fixed;
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 90%;
}
</style>
