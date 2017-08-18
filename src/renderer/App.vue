<template lang="pug">
  #app
    .row
      .col.s12.center
        h4 Etherctron
        p {{addrs}}
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
