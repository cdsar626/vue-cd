<template>
  <nav>
    <ul>
      <router-link to="/" exact><li>Inicio</li></router-link>
      <router-link to="/redes1"><li>Redes1</li></router-link>
      <a href="/files"><li>Archivos</li></a>
      <router-link to="/upload"><li>Upload</li></router-link>
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
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    margin: 0 5px;
  }
  a {
    text-decoration: none;
    color:black;
    transition: border linear 0.15s;
  }
  a:hover{
    color: slategray;
    border-bottom: 5px solid rgb(100,150,200);
    padding-bottom: 0px;
  }
.router-link-active{
  border-bottom: 3px solid rgb(100,150,200);
  padding-bottom: 1px;
}
</style>

<style>
a {
  color: black;
  text-decoration-style: dotted;
}

a:hover {
  color: gray;
}
</style>
