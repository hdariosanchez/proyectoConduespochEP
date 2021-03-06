/*jslint node: true */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();

var config = require(__dirname + '/config.js');
var routes = require('./routes');
var app = express();

var routeEstudiante = require('./routes/routeEstudiante');
var routeDocentePeriodoAsignatura = require('./routes/routeDocentePeriodoAsignatura');
var routePregunta = require('./routes/routePregunta');
var routeTP = require('./routes/routeTipoPregunta');


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
                                                                            // uncomment after placing your favicon in /public
                                                                            //app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join('.', 'app/model')));

                                                                          console.log(". = ", '.');
                                                                          console.log("__dirname = ", path.resolve(__dirname));

app.get('/api/awesomeThings', routes.awesomeThings);
app.route('/api/estudiante').get(routeEstudiante.getlistado);

app.route('/api/asignatura').post(routeDocentePeriodoAsignatura.getlistado);

app.route('/api/pregunta').get(routePregunta.getListado);

app.route('/api/tipoPregunta').get(routeTP.getlistadoTipo);

/*
app.route('/api/pregunta/upload').post(function(req, res){
  console.log('in POST...');
  flow.post(req, function(status, filename, original_filename, identifier) {
    console.log('POST', status, original_filename, identifier);
    res.send(200, {
      // NOTE: Uncomment this funciton to enable cross-domain request.
      'Access-Control-Allow-Origin': '*'
    });
  });
});
*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
