const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

const accountsRouter = require("./routes/accounts");
const interbankRouter = require("./routes/Interbank");
const demoReactjs = require("./routes/demoReactjs");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**Test security policy */
securityPolicy = require("./policies/securityPolicy");
app.use("/test-security-api", securityPolicy, (req, res) =>
  res.status(200).send("success")
);

/**Test security payment policy */
securityPaymentPolicy = require("./policies/securityPaymentPolicy");
app.use("/test-security-api-payment", securityPaymentPolicy, (req, res) =>
  res.status(200).send("success")
);

/* Router of Accounts*/
app.use("/accounts", accountsRouter);

/* Router for interbank*/
app.use("/interbank", interbankRouter);

// app.use("/accounts", accountsRouter);
app.use("/demo", demoReactjs);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send("API not found");
  //next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // return error
  res
    .status(err.status || 500)
    .json({ status: err.status || 500, message: err.message });
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

module.exports = app;
