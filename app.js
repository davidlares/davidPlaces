var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan'); // registrar en el log las peticiones
const jwtMiddleware = require('express-jwt'); // leer los JWTs que lo manda el cliente (valida y generar una propiedad dentro del req)
// base de datos
const db = require('./config/database');
db.connect();

// modelos
const Place = require('./models/Place');

// rutas
const places = require('./routes/places');
const users = require('./routes/users');
const sessions = require('./routes/sessions'); // separar recursos (session vs users)
const favorites = require('./routes/favorites'); // separar recursos (session vs users)
const visits = require('./routes/visits'); // separar recursos (session vs users)
const visitsPlaces = require('./routes/visitsPlaces'); // separar recursos (session vs users)
const applications = require('./routes/applications'); // separar recursos (session vs users)

const findAppBySecret = require('./middlewares/findAppBySecret');
const findAppByApplicationId = require('./middlewares/findAppByApplicationId');
const authApp = require('./middlewares/authApp')();
const allowCORs = require('./middlewares/allowCORs')();

const Application = require('./models/Application');

// importar secrets
const secrets = require('./config/secrets');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(findAppBySecret);
app.use(authApp);
app.use(authApp.unless({method: 'OPTIONS'}));
app.use(allowCORs.unless({path: '/public'}));

// especificar el uso de JWT
app.use(
  jwtMiddleware({secret: secrets.jwtSecret})
    .unless({path: ['/sessions','/users'], method: ['GET','OPTIONS']})
)

// montar routes
app.use('/places', places);
app.use('/places', visitsPlaces);
app.use('/users', users);
app.use('/sessions', sessions);
app.use('/favorites', favorites);
app.use('/visits', visits);
app.use('/applications', applications);

// app.demo('/demo', function(req,res){
//   Application.remove({}).then(r => res.json({}));
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json(err);
});


module.exports = app;
