<template>
  <section> <!-- Información principal del website -->
    <form name="form1" method="POST" action="/upload" enctype="multipart/form-data">
      <input id="file" type="file" name="file1" multiple required>
      <br/>
      <div class="barra">
        <div class="progreso">
        </div>
        <span id="percent"></span>
      </div>
      <input name="btn1" type="submit" value="Submit">
    </form>
    <div id="box">
      <div id="logs"></div>
      <div id="new-log" class="pre"></div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Upload',
    mounted() {
      document.getElementsByName('btn1')[0].addEventListener('click', function(e) {
        e.preventDefault();
        this.setAttribute('disabled', true);
        sendXHR(0);
      });

      function sendXHR(n){
        var fd = new FormData();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);
        var per = 0;
        document.getElementsByClassName('barra')[0].style.display = "block";
        xhr.upload.onprogress = function(ev) {
          if(ev.lengthComputable){
            per = (ev.loaded / ev.total) * 100;
            document.getElementsByClassName('progreso')[0].style.width = per + '%';
            document.getElementById('percent').innerHTML = per + '%';
          }
        };
      
        fd.append('file1',document.getElementById('file').files[n]);
        xhr.send(fd);
        var check = setInterval(function() {
          if(per==100){
            clearInterval(check);
            document.getElementsByClassName('barra')[0].style.display = "none";
            document.getElementById('new-log').innerHTML += `${document.getElementById('file').files[n].name} subido correctamente!<br/>`;
            document.getElementById('new-log').classList.remove('pre');
             setTimeout(function() {
              document.getElementById('new-log').classList.add('pre');
              document.getElementById('logs').innerHTML += document.getElementById('new-log').innerHTML;
              document.getElementById('new-log').innerHTML = '';
            },1000); 
            if(n<Array.from(document.getElementById('file').files).length-1){
              sendXHR(n+1);
            }else{
              document.getElementsByName('btn1')[0].removeAttribute('disabled');
            }
          }
        }, 200);
      }

    }
  }
</script>

<style scoped>
  section {
    margin: auto;
  }
  #myFile {
      margin: 20px;
  }
  #box {
    border-radius: 20px;
    background: linear-gradient(rgba(0,0,0,0.3),rgb(80,210,255))
  }
  #new-log{
    transition: opacity 0.5s linear;
    opacity: 1;
    visibility: visible;
  }
  #new-log.pre{
    opacity: 0;
    visibility: hidden;
  }
  span {
    position: relative;
    top: -1.5em;
    line-height: 0px;
  }

  .barra {
    margin: 5px auto;
    display: none;
    height: 2em;
    background-color: gray;
  }

  .progreso {
    height: 2em;
    width: 1%;
    background-color: limegreen;
  }
</style>
