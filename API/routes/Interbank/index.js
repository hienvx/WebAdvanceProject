const express = require("express");
const router = express.Router();
const DB = require("../../scripts/db");

const securityPolicy = require("../../policies/securityPolicy");
const securityPaymentPolicy = require("../../policies/securityPaymentPolicy");

/* Router for getting name's account */
router.get(
  "/getAccount/:numberAccount",
  securityPolicy,
  async (req, res, next) => {
    let customer = null;
    const numberAccount = req.params.numberAccount;
    try {
      customer = await DB.Find("customers", {
        paymentAccount: {
          $exists: {
            numberAccount: numberAccount,
          },
        },
      });
      // console.log(customer);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
    return res.status(200).json({ fullName: customer[0].profile.fullName });
  }
);

/* Router for transferring money of payment */
router.post(
  "/payment/transfer",
  // securityPaymentPolicy,
  async (req, res, next) => {
    /*
     * req.body.data = {
     *   "numberAccount": "", // số tài khoản cần nạp
     *   "amount" : "", //số tiền nạp
     *   "employeeAccount": "" // tài khoản nhân viên nạp
     * }
     * */
    let customer = null;
    const numberAccount = req.body.data.numberAccount;
    const amount = req.body.data.amount;
    const employeeAccount = req.body.data.employeeAccount;

    try {
      customer = await DB.Find("customers", {
        paymentAccount: {
          $exists: {
            numberAccount: numberAccount,
          },
        },
      });

      if (customer.length > 0) {
        await DB.Update(
          "customers",
          {
            "paymentAccount.numberAccount":
              customer.paymentAccount.numberAccount,
            "paymentAccount.amount": customer.paymentAccount.amount + amount,
          },
          {
            paymentAccount: {
              $exists: {
                numberAccount: numberAccount,
              },
            },
          }
        );
      } else
        return res
          .status(500)
          .json({ code: 500, message: "Number's account not found" });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
    return res.status(200).json({ fullName: customer[0].profile.fullName });
  }
);

module.exports = router;
