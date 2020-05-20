let express = require('express');
let router = express.Router();
let DB = require('../../../scripts/db');
const moment = require('moment');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Test api');
});

router.get('/:id', async function (req, res, next) {
    let account = req.params.id;
    let customers = await DB.Find("customers", {"account": account});

    if (customers.length == 0) {
        res.json([]);
    }

    let customer = customers[0];
    let result = {
        "account": customer.account,
        "paymentAccount": customer.paymentAccount,
        "savingAccount": customer.savingAccount,
        "profile": customer.profile
    };

    res.json(result);
});


router.post('/payment/Account',
    async function (req, res, next) {
        /*
        * req.body.data = {
        *   "account": "", // tài khoản cần nạp
        *   "amount" : "", //số tiền nạp
        *   "employeeAccount": "" // tài khoản nhân viên nạp
        * }
        * */

        let account = req.body.account;
        let amount = req.body.amount;
        let employeeAccount = req.body.employeeAccount;

        let customers = await DB.Find("customers", {"account": account});

        if (customers.length == 0) {
            res.send(false);
            return;
        }

        let customer = customers[0];
        let currentBalance = customer.paymentAccount.currentBalance;

        let status = await DB.Update(
            "customers",
            {
                "paymentAccount":
                    {
                        "numberAccount": customer.paymentAccount.numberAccount,
                        "currentBalance": parseInt(currentBalance) + parseInt(amount)
                    }
            },
            {"account": customer.account});
        if (status) {
            let log = {
                "account": customer.account,
                "content": {
                    "amount": amount,
                    "OperationType": "NAP",
                    "performer": {
                        "type": "employee",
                        "account": employeeAccount
                    }
                },
                "time": moment().unix()
            };
            await DB.Insert("transaction_history", [log]);
            res.send(true);
        } else {
            res.send(false);
        }
    });

router.post('/payment/NumberAccount',
    async function (req, res, next) {

        /*
            * req.body.data = {
            *   "numberAccount": "", // số tài khoản cần nạp
            *   "amount" : "", //số tiền nạp
            *   "employeeAccount": "" // tài khoản nhân viên nạp
            * }
            * */

        let numberAccount = req.body.numberAccount;
        let amount = req.body.amount;
        let employeeAccount = req.body.employeeAccount;

        let customers = await DB.Find(
            "customers",
            {

                "paymentAccount.numberAccount":numberAccount

            });
        console.log(customers);
        if (customers.length == 0) {
            res.send(false);
            return;
        }

        let customer = customers[0];
        let currentBalance = customer.paymentAccount.currentBalance;
        let account = customer.account;

        let status = await DB.Update(
            "customers",
            {
                "paymentAccount":
                    {
                        "numberAccount": customer.paymentAccount.numberAccount,
                        "currentBalance": parseInt(currentBalance) + parseInt(amount)
                    }
            },
            {
                "paymentAccount.numberAccount":customer.paymentAccount.numberAccount
            });
        if (status) {
            let log = {
                "account": account,
                "content": {
                    "amount": amount,
                    "OperationType": "NAP",
                    "performer": {
                        "type": "employee",
                        "account": employeeAccount
                    }
                },
                "time": moment().unix()
            };
            await DB.Insert("transaction_history", [log]);
            res.send(true);
        } else {
            res.send(false);
        }

    });


module.exports = router;
