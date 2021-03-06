
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');
 

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({secret: 'secret', key: 'express.sid'}));

var server = http.createServer(app);
io = io.listen(server);

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index', {
    title: 'Accueil'});
});

app.get('/draw', function(req, res){
  res.render('draw', {
    title: 'Dessin'});
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var active_connections = 0;

io.sockets.on('connection', function (socket) {

  active_connections++

  io.sockets.emit('user:connect', active_connections);
    socket.on('disconnect', function () {
    active_connections--
    io.sockets.emit('user:disconnect', active_connections);
  });
  socket.on('draw:progress', function (uid, co_ordinates) {
    
    io.sockets.emit('draw:progress', uid, co_ordinates)

  });
  socket.on('draw:end', function (uid, co_ordinates) {
    
    io.sockets.emit('draw:end', uid, co_ordinates)

  });
});