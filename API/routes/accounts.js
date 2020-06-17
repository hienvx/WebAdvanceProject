let express = require("express");
let router = express.Router();
let DB = require("../scripts/db");
const moment = require("moment");
let { security } = require("./securityAPI");
let { securityPayment } = require("./securityAPIPayment");
/* GET users listing. */

router.post("/", function (req, res, next) {
  res.send("Test api");
});
const AuthMiddleWare = require("../scripts/AuthMiddleware");
const AuthController = require("../scripts/AuthController");
const AuthEmployeeController = require("../scripts/AuthEmployeeController");

router.post("/Auth/isAuth", AuthMiddleWare.isAuth);
router.post("/Auth/login", AuthController.login);
router.post("/Auth/loginEmployee", AuthEmployeeController.login);
router.post("/Auth/logout", AuthController.logout);
/*router.use(AuthMiddleWare.isAuth);*/
router.post("/Auth/refresh-token", AuthController.refreshToken);


router.get("/UserAccount/:userAccount", async function (req, res, next) {
  let account = req.params.userAccount;

  let customers = await DB.Find("customers", { account: account });

  if (customers.length == 0) {
    res.send({"status": false, "message": "User is not exist", data:[]});
  }

  let customer = customers[0];
  let result = {
    account: customer.account,
    //"paymentAccount": customer.paymentAccount,
    //"savingAccount": customer.savingAccount,
    profile: customer.profile,
  };

  res.send({"status": true, "message": "", data:result});
});

router.get("/NumberAccount/:numberAccount", async function (req, res, next) {
  let account = req.params.numberAccount;
  let customers = await DB.Find("customers", { "paymentAccount.numberAccount": account });

  if (customers.length == 0) {
    res.send({"status": true, "message": "", data:[]});
  }

  let customer = customers[0];
  let result = {
    account: customer.account,
    //"paymentAccount": customer.paymentAccount,
    //"savingAccount": customer.savingAccount,
    profile: customer.profile,
  };

  res.send({"status": true, "message": "", data: result});
});


router.post("/payment/Account", async function (
  req,
  res,
  next
) {
  /*
   * req.body.data = {
   *   "account": "", // tài khoản cần nạp
   *   "amount" : "", //số tiền nạp
   *   "employeeAccount": "" // tài khoản nhân viên nạp
   *   "bank":"" // Ngân hàng nạp
   * }
   * */

  /*
   * Thiếu bước giải mã gói tin
   */
  let account = req.body.data.account;
  let amount = req.body.data.amount;
  let employeeAccount = req.body.data.employeeAccount;
  let bank = req.body.data.bank;
  let customers = await DB.Find("customers", { account: account });

  if (customers.length == 0) {
    res.send({"status": false, "message": "User is not exist"});
    return;
  }

  let customer = customers[0];
  let currentBalance = customer.paymentAccount.currentBalance;

  let status = await DB.Update(
    "customers",
    {
      paymentAccount: {
        numberAccount: customer.paymentAccount.numberAccount,
        currentBalance: parseInt(currentBalance) + parseInt(amount),
      },
    },
    { account: customer.account }
  );
  if (status) {
    let log = {
      account: customer.account,
      amount: amount,
      type: 1, // "Nạp tiền" : ["Chuyển khoản", "Nạp tiền", "Rút tiền", "Nhận tiền"]
      performer: {
        type: "employee",
        account: employeeAccount,
      },
      bank:bank,
      time: moment().unix(),
    };
    await DB.Insert("transaction_history", [log]);
    res.send({"status": true, "message": ""});
  } else {
    res.send({"status": false, "message": "An error occurred"});
  }
});

router.post("/payment/NumberAccount", async function (
  req,
  res,
  next
) {
  /*
   * req.body.data = {
   *   "numberAccount": "", // số tài khoản cần nạp
   *   "amount" : "", //số tiền nạp
   *   "employeeAccount": "" // tài khoản nhân viên nạp
   *   "bank": "" // ngân hàng nạp
   * }
   * */

  /*
   * Thiếu bước giải mã gói tin
   */
console.log(req.body.data)
  let numberAccount = req.body.data.numberAccount;
  let amount = req.body.data.amount;
  let employeeAccount = req.body.data.employeeAccount;
  let bank = req.body.data.bank || "KAT";

  let customers = await DB.Find("customers", {
    "paymentAccount.numberAccount": numberAccount,
  });

  if (customers.length == 0) {
    res.send({"status": false, "message": "User is not exist"});
    return;
  }

  let customer = customers[0];
  let currentBalance = customer.paymentAccount.currentBalance;
  let account = customer.account;

  let status = await DB.Update(
    "customers",
    {
      paymentAccount: {
        numberAccount: customer.paymentAccount.numberAccount,
        currentBalance: parseInt(currentBalance) + parseInt(amount),
      },
    },
    {
      "paymentAccount.numberAccount": customer.paymentAccount.numberAccount,
    }
  );
  if (status) {
    let log = {
      account: account,
      amount: amount,
      type: 1 ,// "Nạp tiền" : ["Chuyển khoản", "Nạp tiền", "Rút tiền", "Nhận tiền"]
      performer: {
        type: "employee",
        account: employeeAccount,
      },
      bank: bank,
      time: moment().unix(),
    };
    await DB.Insert("transaction_history", [log]);
    res.send({"status": true, "message": ""});
  } else {
    res.send({"status": false, "message": "An error occurred"});
  }
});

module.exports = router;
