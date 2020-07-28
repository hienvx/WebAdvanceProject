const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const accountsRouter = require("./routes/accounts");
const historyTransactionRouter = require("./routes/historyTransaction");
const banksConnectedRouter = require("./routes/banksConnected");
const employeesRouter = require("./routes/employees");
const customersRouter = require("./routes/customers");
const interbankRouter = require("./routes/interbank");
const demoReactjs = require("./routes/demoReactjs");
const { security } = require("./routes/securityAPI");
const { securityPayment } = require("./routes/securityAPIPayment");

const app = express();
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/test-security-api", security);
app.use("/test-security-api-payment", securityPayment);
app.use("/accounts", accountsRouter);
app.use("/api/interbank", interbankRouter);
app.use("/history", historyTransactionRouter);
app.use("/banks", banksConnectedRouter);
app.use("/employees", employeesRouter);
app.use("/customers", customersRouter);
// app.use("/accounts", accountsRouter);
app.use("/demo", demoReactjs);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send("API not found");
  //next(createError(404));
});

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
