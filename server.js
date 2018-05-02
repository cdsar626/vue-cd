var express = require('express');
var history = require('connect-history-api-fallback');
var serveIndex = require('serve-index'); //lista archivos en directorio
var fs = require('fs'); //manejar filesystem
var bodyParser = require('body-parser');
var multer = require('multer'); //manejar archivos no-texto
var morgan = require('morgan'); //log files
var rfs = require('rotating-file-stream'); //log files daily


var app = express();
app.use(history());
app.use(express.static('dist'));
var logDirectory = 'dist/logs';
//fs.existSync(logDirectory);
var accessLogStream = rfs('log.txt', { interval: '1d', path: logDirectory});
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/files', serveIndex('dist/files', {'icons': true,'view':'details'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({dest: '/sdcard/web/tmp'}).single('file'));
//var upload = multer({ dest: '/sdcard/tmp'});

  


app.post('/uploading', function(req, res){
	var file = "/sdcard/web/public/files/" + req.file.originalname;
	
	fs.readFile( req.file.path, function (err, data) { //Se lee el archivo entrante a data
		fs.writeFile(file, data, function(err){  //Se escribe data a la carpeta files
			if(err) {
				console.log(err);
			}else{
				console.log(req.file.originalname + ' subido al servidor.');
				res.send('archivo subido</br>' +
					'<a href="/files">Ver archivos.</a>');
			}
		});
		
	});
	
});

app.post('/blog', function(req, res){
	let fecha = new Date();
	let content = ''+Date.parse(fecha)+'\n'+req.body.contenido;
	let file = '/sdcard/web/posts/'+fecha.toISOString().replace(/ /g,'').slice(0,10)+
		'_'+fecha.toLocaleTimeString().slice(0,9)+'.txt';
	fs.writeFile(file, content, function(err){
		if(err){
			console.log(err);
		}else{
			console.log('Nuevo post publicado');
			res.redirect('/blog');
		}
	});
});

var server = app.listen(1234, function() {
})
