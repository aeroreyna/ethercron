<template lang="pug">
  #app
    .row
      .col.s12
        .row
          .right(v-on:click="logout()")
            p Logout
    router-view
</template>

<script>
  export default {
    name: 'etherctron',
    data(){
      return {
        addrs: localStorage.etherAddrs ? localStorage.etherAddrs : undefined,
      }
    },
    methods:{
      logout(){
        localStorage.etherAddrs='';
        location.reload();
      },
    }
  }
</script>

<style>
  /* CSS */
</style>
