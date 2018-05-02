<template>
  <div>
    <h1>Proyecto de Redes 1</h1>
    <h3>Realización de protocolos (Capa de enlace) </h3>
    <h5>Para más detalles Ctrl+Shift+I (consola) </h5>
    <div id="chat">
      <div id="historial">
      </div>
      <br/>
      <div id="chatSaliente" class="chat">
        <textarea placeholder="Texto a enviar" id="saliente" maxlength="200"></textarea>
      </div>
      <div id="chatEntrante" class="chat">
        <textarea placeholder="Espacio donde llegan las tramas" id="entrante" maxlength="2432"></textarea>
      </div>
      <br>
      <button id="btnSend">Codificar</button>
      <button id="btnRec">Decodificar</button>
      <br>
      <button id="btnTest">Probar altavoz</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Redes1'
}
</script>

<style scoped>
  div {
    margin: auto;
  }
</style>
