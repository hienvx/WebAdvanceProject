let express = require("express");
let router = express.Router();
let DB = require("../scripts/db");
const moment = require("moment");
let { security } = require("./securityAPI");
let { securityPayment } = require("./securityAPIPayment");

router.get("/get-account-info", security, async (req, res, next) => {
  const numberAccount = req.query.number;
  //processing exceptions
  if (!numberAccount)
    return res
      .status(500)
      .json({ status: "500", message: "need to provide number account" });

  //prepare and return data
  const customers = await DB.Find("customers", {
    "paymentAccount.numberAccount": numberAccount,
  });

  if (customers.length === 0)
    return res
      .status(500)
      .send({ status: 500, message: "wrong number account" });

  const customer = customers[0];

  return res.status(200).json({
    status: 200,
    data: {
      fullName: customer.profile.fullName,
    },
  });
});

router.post("/deposit", securityPayment, async (req, res, next) => {
  try {
    const numberAccount = req.body.numberAccount.toString();
    const amount = req.body.amount.toString();

    //processing exceptions
    if (!numberAccount)
      return res
        .status(500)
        .json({ status: "500", message: "need to provide number account" });
    if (!amount)
      return res
        .status(500)
        .json({ status: "500", message: "need to provide number amount" });

    //prepare and return data
    const customers = await DB.Find("customers", {
      "paymentAccount.numberAccount": numberAccount.toString(),
    });

    if (customers.length === 0)
      return res
        .status(500)
        .send({ status: 500, message: "wrong number account" });

    const customer = customers[0];

    //create transaction history
    await DB.Insert("transaction_history", [
      {
        account: customer.account,
        type: 1,
        amount: req.body.amount,
        time: Date.now(),
        fromBank: req.headers.code,
        timeInterBank: req.headers["request-time"],
        auth_hash: req.headers["auth-hash"],
        pgp_sig: req.headers["pgp-sig"],
      },
    ]);

    //transfer to local account
    currentBalance = parseInt(customer.paymentAccount.currentBalance + 0);
    await DB.Update(
      "customers",
      {
        "paymentAccount.currentBalance": (
          currentBalance + parseInt(amount)
        ).toString(),
      },
      { account: customer.account }
    );
    //return
    return res.status(200).json({
      status: 200,
      message: "OK",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
});

module.exports = router;
