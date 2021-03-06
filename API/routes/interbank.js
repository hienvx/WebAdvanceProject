let express = require("express");
let router = express.Router();
let DB = require("../scripts/db");
const moment = require("moment");
let { security } = require("./securityAPI");
let { securityPayment } = require("./securityAPIPayment");
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");

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
    console.log("numberAccount", numberAccount);
    const amount = req.body.amount.toString();
    console.log("amount", amount);

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

    let log = {
      account: customer.account,
      amount: req.body.amount,
      type: 3, // "Nạp tiền" : ["Chuyển khoản", "Nạp tiền", "Rút tiền", "Nhận tiền"]
      performer: {
        type: "employee",
        account: "employeeAccount",
      },
      bank: req.headers.code,
      time: moment().unix(),
      timeInterBank: req.headers["request-time"],
      auth_hash: req.headers["auth-hash"],
      pgp_sig: req.headers["pgp-sig"],
    };

    //create transaction history
    await DB.Insert("transaction_history", [log]);

    //transfer to local account
    currentBalance = parseInt(customer.paymentAccount.currentBalance);
    console.log("currentBalance", currentBalance);
    const newBalance = currentBalance + parseInt(amount);
    console.log("newBalance", newBalance);
    await DB.Update(
      "customers",
      {
        "paymentAccount.currentBalance": newBalance.toString(),
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

//get accounts info from KAT
router.get("/KAT/get-account-info", async (req, res, next) => {
  const timestamp = Date.now();
  const secret = "HjvV0rNq1GOvnPZmNaF3";
  const dataToHash = timestamp + secret + "{}";
  const credit_number = req.query.credit_number;

  let hashString = crypto
    .createHash("sha256")
    .update(dataToHash)
    .digest("base64");

  await axios
    .get(
      "http://bank-backend.khuedoan.com/api/partner/get-account-info?credit_number=" +
        credit_number,
      {
        headers: {
          "partner-code": "N42",
          timestamp: timestamp,
          "authen-hash": hashString,
        },
      }
    )
    .then((response) => {
      return res
        .status(200)
        .json({ name: response.data.lastname + " " + response.data.firstname });
    })
    .catch((error) => {
      return res.status(500).json(error.response.data);
    });
});

//get accounts info from TCK
router.get("/tckbank/get-account-info", async (req, res, next) => {
  const credit_number = req.query.credit_number;
  console.log("credit_number", credit_number);
  await axios
    .post("https://tckbank.herokuapp.com/deposits/account_number", {
      account_number: credit_number,
    })
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json(error.response.data);
    });
});

function RSASign(privateKey, data) {
  const sign = crypto.createSign("RSA-SHA256");
  const signature = sign.update(data).sign(privateKey, "base64");
  console.log(signature);
  return signature;
}

function RSAVerify(publicKey, signature, data) {
  const verify = crypto.createVerify("RSA-SHA256");
  verify.update(data);
  console.log(verify.verify(publicKey, signature, "base64"));
}

//chuyen tien toi KAT
router.post("/KAT/deposit", async (req, res, next) => {
  const timestamp = Date.now();
  const secret = "HjvV0rNq1GOvnPZmNaF3";
  const dataToHash = timestamp + secret + JSON.stringify(req.body);
  const credit_number = req.query.credit_number;

  const privateKey = fs.readFileSync("./secrets/rsa/privatekey.rsa");
  const signature = RSASign(privateKey, dataToHash);

  let hashString = crypto
    .createHash("sha256")
    .update(dataToHash)
    .digest("base64");

  await axios
    .post(
      "http://bank-backend.khuedoan.com/api/partner/deposit",
      {
        ...req.body,
      },
      {
        headers: {
          "partner-code": "N42",
          timestamp: timestamp,
          "authen-hash": hashString,
          "authen-sig": signature.toString(),
        },
      }
    )
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json(error.response.data);
    });
});
module.exports = router;
