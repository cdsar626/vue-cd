var express = require('express');
var formidable = require('formidable');
var serveIndex = require('serve-index');


var app = express();
app.use(express.static('./dist'));
app.use('/files', serveIndex('./dist/files', { 'icons': true, 'view': 'details' }));

app.post('/upload', function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req);
  form.on('fileBegin', function(name, file){
    file.path = './dist/files/' + file.name;
  });
  form.on('file', function(name, file){
    console.log(`uploaded ${file.name} succesfully!`);
  });
})
let puerto = 80;
app.listen(puerto, function(){
  console.log(`escuchando en localhost:${puerto}`);
});