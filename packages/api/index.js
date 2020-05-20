let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let hbs = require('hbs');
let path = require('path')

let accountsRouter = require('./routes/accounts');
let demoReactjs = require('./routes/demoReactjs');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/accounts', accountsRouter);
app.use('/demo', demoReactjs);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.send("API not found");
    //next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
