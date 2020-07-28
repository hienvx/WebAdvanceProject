let express = require("express");
let router = express.Router();
let DB = require("../scripts/db");
const moment = require("moment");
let { security } = require("./securityAPI");
let { securityPayment } = require("./securityAPIPayment");

router.get("/getInfo/:number", security, async (req, res, next) => {
  const numberAccount = req.params.number;
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
  console.log("customers", customers);
  console.log("customer", customer);

  return res.status(200).json({
    status: 200,
    data: {
      fullName: customer.profile.fullName,
    },
  });
});

module.exports = router;
