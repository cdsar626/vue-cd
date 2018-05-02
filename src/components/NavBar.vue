<template>
  <nav>
    <ul>
      <a href="/"><li>Inicio</li></a>
      <a href="/redes1"><li>Redes1</li></a>
    </ul>
  </nav>
</template>

<script>
  export default {
    name: 'NavBar'
  }
</script>

<style scoped>
  nav {
    margin: auto;
    background-color: rgba(200,200,200,0.5);
    width: 30%;
    border-radius: 8px;
  }
  nav ul {
    padding: 0;
    text-align: center;
  }
  nav li {
    display: inline-block;
    list-style: none;
    border-bottom: 5px solid transparent;
    margin: 0 5px;
  }
  nav li:hover {
    border-bottom: 5px solid rgb(100,150,200);
  }
</style>