<template lang="pug">
  #app
    .row
      .col.s12
        .row
          .left
            p settings
          .right
            p Online - Noti - USD
              span  ---
    router-view
</template>

<script>
  export default {
    name: 'etherctron',
    data(){
      return {
        addrs: localStorage.etherAddrs ? localStorage.etherAddrs : undefined,
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
