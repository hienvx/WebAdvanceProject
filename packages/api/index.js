let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let hbs = require('hbs');

let accountsRouter = require('./routes/accounts');


let app = express();

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());



app.use('/accounts', accountsRouter);


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
