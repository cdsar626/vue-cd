<template>
  <div id="app">
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
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  require('../assets/jquery-3.2.1.min.js');

  export default {
    name: 'Redes1',
    mounted() {
        $(document).ready( function() {
          function hamming(cadena) { //Funcion hamming, devuelve una cadena con Hamming aplicado
                var nueva="";
                let k=0;
                for(let i=0, k=0; i<=cadena.length+Math.log2(cadena.length); i++) { //Genera vector rellenado con 0
                  if(i==2**k-1){
                    k++;
                    nueva+="0";
                  }else{
                    nueva+=cadena[i-k]
                  }
                }
                k=0;
                let arrayBuff=nueva.split("");
                for(let i=0;i<nueva.length;i=i+2**k, k++){    //Calcula los bits de paridad segun Hamming
                  let pares=0;
                  let inArow=0;
                  for(let j=2**k-1;j<nueva.length;j++){
                    if(nueva[j]==1) pares++;
                    inArow++;
                    if (inArow==2**k) {
                      inArow=0;
                      j=j+2**k;
                    }
                  }
                  //console.log(pares);
                  (pares%2)?arrayBuff[i]="1":arrayBuff[i]="0";
                }
                return (arrayBuff.join(""));

          }
          //Fin Hamming

              function obtenerHamming(cadena){  //Retorna los bits que fueron agregados por hamming en un string/arreglo
                let Hamming = "";
                for(let k = 0; k <= Math.log2(cadena.length); k++){
                  Hamming+=cadena[2**k-1];
                }
                return Hamming;
              }

              function quitarHamming(cadena){  //Quita los bits agregados por Hamming de la trama
                let mensaje = "";
                let k=0;
                for(let i = 0; i<cadena.length; i++){
                  if(i==2**k-1) k++;
                  else mensaje += cadena[i];
                }
                return mensaje
              }

          //Agarra el mensaje codificado (del 2do campo de texto)
          //le quita las tramas, resuelve hamming, lo pasa a char otra vez
          //y lo refleja en el bloque "historial"
          $("#btnRec").on("click", function() {
            var mensajeBin = $("#entrante").val();
            var mensajeDecod = "";

            if(mensajeBin.length%8==0){
              console.log("Inicio Decodificación.");
              let TTLtrama=0;
              do{

                //Reconocer flags de Inicio y Final
                //y separar por tramas
                let ini = 0 , fin = 0;
                let TTLflags = 0;
                for(let i = 0; !fin && TTLflags<500 && i<mensajeBin.length; i+=8){
                  if(mensajeBin.slice(i,i+8) == "01111110" ) {
                    if(ini)	fin = i;
                    else ini = i+8;
                  }
                  TTLflags++;
                }
                if(TTLflags==500){
                  alert("Fallo procesando flags del mensaje.\n"
                  + "Mensaje descartado.");
                  break;
                }

                let mensajeCod=mensajeBin.slice(ini,fin);
                mensajeBin=mensajeBin.slice(fin); //igual a si mismo menos la trama en proceso
                if (mensajeCod=="") {
                  TTLtrama++;
                  continue;
                }
                console.log("Mensaje decod sin flags: " + mensajeCod);


                //Leer datos de control
                let seq, last, relleno;
                seq = Number(mensajeCod[0])*8 + Number(mensajeCod[1])*4
                    + Number(mensajeCod[2])*2 + Number(mensajeCod[3]);
                last = Number(mensajeCod[4]);
                relleno = Number(mensajeCod[5])*4 + Number(mensajeCod[6])*2 + Number(mensajeCod[7]);

                mensajeCod=mensajeCod.slice(8); 
                console.log("mensaje decod sin control: " + mensajeCod + "\n"
                      + "#seq: " + seq + "\n"
                      + "last: " + last + "\n"
                      + "#relleno: " + relleno);


                //Quitar relleno de bits y
                //Quitar completación de ceros para que quedara en multiplo de 8
                mensajeCod = mensajeCod.slice(relleno);
                let cuenta = 0;
                let TTLcontrol = 0;
                for(let i = 0; i<mensajeCod.length && TTLcontrol<500; i++){
                  if(mensajeCod[i]=="1") cuenta ++;
                  else cuenta=0;
                  if(cuenta == 5) mensajeCod = mensajeCod.slice(0, i+1) + mensajeCod.slice(i+2);
                  TTLcontrol++;
                }
                if(TTLcontrol==500)alert("TTLcontrol");
                console.log("mensaje decod sin relleno de bits: " + mensajeCod);



                //The hard-one
                //Analizar y quitar Hamming
                let hOrig = obtenerHamming(mensajeCod); //bits del hamming original
                let msjDeco = quitarHamming(mensajeCod);
                let hRecibido = obtenerHamming(hamming(msjDeco)); //bits del hamming recibido

                if(hOrig!=hRecibido){
                  let respuesta = confirm("Se ha detectado un error en la transmisión.\n" +
                    "¿Desea reenviar el mensaje?");
                  if(respuesta) {
                    $("#btnSend").trigger("click");
                    break;
                  }
                }

                console.log("mensaje sin Hamming: " + msjDeco);

                //Transformar de binario a char :D
                for(let i=0; i<msjDeco.length; i+=8){
                  mensajeDecod += String.fromCharCode(parseInt(msjDeco.slice(i,i+8),2).toString(10));
                }
                TTLtrama++;
                
                if(last) break;
              }while(TTLtrama<500);
              if(TTLtrama==500){
                if(confirm("Error interpretando tramas, TTL excedido.\n"
                +"¿Volver a enviar mensaje?")){
                  $("#btnSend").trigger("click");
                }
              }
            }else{
              alert("Error: la cantidad de bits en el mensaje no es multiplo de 8\n"
                + "Vuelva a reenviar el mensaje.");
            }

            if(mensajeDecod!=""){
              let date = new Date();
              let hora = (date.getHours()<10)?"0" + date.getHours():"" + date.getHours();
              let min = (date.getMinutes()<10)?"0" + date.getMinutes():"" + date.getMinutes();
              let sec = (date.getSeconds()<10)?"0" + date.getSeconds():"" + date.getSeconds();
              let timeString = hora + ":" + min + ":" + sec;
              $("#historial").html($("#historial").html() + timeString +": " + mensajeDecod + "</br>");
              console.log("Fin de recepción.");
            }
          })

          //Agarra mensaje (string), lo divide en tramas mas pequeñas (si es necesario) 
          //y hace Hamming + entramado a cada una. Las coloca en el 2do campo de texto
          $("#btnSend").on("click", function() {
            var mensaje = $("#saliente").val();  //Mensaje en string
            $("#entrante").val("");   //Vaciamos campo donde se almacenaran las tramas
            console.log("Mensaje original: " + mensaje);

            //Representar los caracteres en una cadena de binario
            var origBin = "";
            for(let i=0;i<mensaje.length;i++){
              let actCharAscii = mensaje.charCodeAt(i);
              if(actCharAscii >255) {
                actCharAscii = '';
              }else{
                actCharAscii = '00000000'.slice(actCharAscii.toString(2).length) + actCharAscii.toString(2);
              }

              origBin += actCharAscii;
            }
            console.log("Mensaje orig en binario: " + origBin);


            //El mensaje original se dividirá cada 13 caracteres <=> 104 bits
            let trama = 0;
            let final = 0;
            do{
              if(origBin.length-trama*104>104){
                var bin = origBin.slice(trama*104,(trama+1)*104);
              }else{
                var bin = origBin.slice(trama*104);
                final=1;
              }

              console.log("trama " + trama + ": " + bin.length);

              //Hamming

              var bufferEntrante = hamming(bin);
              console.log("cadena Hamming: " + bufferEntrante);



              //Relleno de bits
              let cuenta=0;
              for(let i=0;i<bufferEntrante.length;i++){
                if(bufferEntrante[i]==1) cuenta++;
                else cuenta=0;
                if(cuenta==5){
                  bufferEntrante=bufferEntrante.slice(0,i+1)+"0"+bufferEntrante.slice(i+1);
                  cuenta=0;
                }
              }
              console.log("Relleno de bits: "+bufferEntrante);




              //Completación de bits para que la data sea enviada en multiplo de 8
              let sobrante = bufferEntrante.length%8;
              //console.log(sobrante);
              if(sobrante!=0){
                bufferEntrante = "00000000".slice(sobrante) + bufferEntrante;
                }
              console.log("Completacion multiplo 8: " + bufferEntrante);


              //Bits de control [4 bits de # de trama + 1 bit de final de mensaje + 3 bits que indican con cuantos 0 se completó]
              bufferEntrante="0000".slice(trama.toString(2).length) + trama.toString(2) 
                      + final 
                      + "000".slice(((8-sobrante)%8).toString(2).length) + ((8-sobrante)%8).toString(2) 
                      + bufferEntrante;
              console.log("Bits de control: " + bufferEntrante);


              //Banderas de inicio y fin
              bufferEntrante = "01111110" + bufferEntrante + "01111110";
              console.log("Banderas I/F: " + bufferEntrante); //Trama final con todo el entramado
              if(mensaje=="")bufferEntrante="";
              $("#entrante").val( $("#entrante").val() + bufferEntrante);
              trama++;
            }while(origBin.length>104*trama);

          })
        })
    }

  }

</script>

<style scoped>
  #app {
    margin: auto;
  }
  .chat {
    display: inline-block;
    width: 300px;
    height: 50px;
    margin: 5px;
  }

  .chat > textarea {
    width: inherit;
    height: inherit;
    border: solid 2px;
    border-radius: 8px;
    resize: none;
  }

  #historial {
    text-align: left;
    width: 500px;
    height: 200px;
    background-color: white;
    display: inline-block;
    border: 2px solid;
    border-radius: 8px;
    font-size: 13px;
    overflow: auto;
  }
</style>
