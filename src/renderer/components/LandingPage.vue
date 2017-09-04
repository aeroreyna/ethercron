<template lang="pug">
#LandingPage.container
  .row(v-if="!addrs")
    .col.s12.center.m2
      h5 Address
    .col.s12.center.m8
      input.center(type="text" v-model="addrsInput")
    .col.s12.center.m2
      p.btn(v-on:click="getAddressInfoL") Go
  .row
    .loading(v-if="addrs && lag")
      h5 Loading Information
      p Address: {{addrs}}
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
          .token-container
            .col.s7
              h5 {{t.name}}
              h5
                small {{t.amount}}
            .col.s5
              h5.right-align(v-bind:class="{'teal-text': t.rise, 'deep-orange-text': !t.rise}") ${{t.balance.toFixed(2)}}
              .right-align.indigo-text.text-lighten-3 {{t.price}} USD
                br
                | {{t.priceETH}} ETH
            .col.s12(v-if="t.txs && selected == i ")
              .col.s6.center
                p Invest
                h5 {{sumTx(t.txs).toFixed(2)}}
              .col.s5.center
                p Profit
                h5(v-bind:class="{'teal-text': sumTx(t.txs)<t.balance, 'deep-orange-text': sumTx(t.txs)>t.balance}") {{(t.balance - sumTx(t.txs)).toFixed(2)}}
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
        localStorage.etherAddrs = this.addrsInput;
        this.addrs = this.addrsInput;
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
.tocken.active{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.9);
}
.tocken.active .token-container{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.2s;
  background-color: white;
  position: fixed;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%);
  width: 90%;
}
</style>
