<template>
  <div>
    <header>
    <h1><br/><router-link to="/" exact><img src="./assets/pata_black_A_small.png">cdsar626</router-link></h1>
    </header>
    <NavBar></NavBar>
    <div id="flex">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  export default {
    name: 'web',
    components: {
      NavBar
    }
  }
</script>

<style>
  body {
    background-color: rgb(80,210,255);
    text-align: center;
  }
  header {
    text-shadow: gray 8px 8px 5px;
    color: rgb(35,220,190);
  }
  header a{
    text-decoration: none;
    color: inherit;
  }
  header a:hover {
    color: inherit;
  }
  header img {
    height:3em;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: -1;
  }

  #flex {
    display: flex;
    margin-left: 4%;
    margin-right: 4%;
  }
</style>
