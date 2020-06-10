let express = require('express');
let router = express.Router();
let DB = require('../scripts/db');
const moment = require('moment');
let {security} = require('./securityAPI');
let {securityPayment} = require('./securityAPIPayment');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Test api');
});
const AuthMiddleWare = require("../scripts/AuthMiddleware");
const AuthController = require("../scripts/AuthController");

router.post("/Auth/login", AuthController.login);
router.post("/Auth/refresh-token", AuthController.refreshToken);
router.use(AuthMiddleWare.isAuth);

router.get('/:id', security, async function (req, res, next) {
    let account = req.params.id;
    let customers = await DB.Find("customers", {"account": account});

    if (customers.length == 0) {
        res.json([]);
    }

    let customer = customers[0];
    let result = {
        "account": customer.account,
        //"paymentAccount": customer.paymentAccount,
        //"savingAccount": customer.savingAccount,
        "profile": customer.profile
    };

    res.json(result);
});


router.post('/payment/Account', securityPayment,
    async function (req, res, next) {
        /*
        * req.body.data = {
        *   "account": "", // tài khoản cần nạp
        *   "amount" : "", //số tiền nạp
        *   "employeeAccount": "" // tài khoản nhân viên nạp
        * }
        * */

        /*
        * Thiếu bước giải mã gói tin
        * */

        let account = req.body.data.account;
        let amount = req.body.data.amount;
        let employeeAccount = req.body.data.employeeAccount;

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

router.post('/payment/NumberAccount', securityPayment,
    async function (req, res, next) {

        /*
            * req.body.data = {
            *   "numberAccount": "", // số tài khoản cần nạp
            *   "amount" : "", //số tiền nạp
            *   "employeeAccount": "" // tài khoản nhân viên nạp
            * }
            * */

        /*
        * Thiếu bước giải mã gói tin
        */

        let numberAccount = req.body.data.numberAccount;
        let amount = req.body.data.amount;
        let employeeAccount = req.body.data.employeeAccount;

        let customers = await DB.Find(
            "customers",
            {

                "paymentAccount.numberAccount":numberAccount

            });
        
        if (customers.length == 0) {
            res.send(false);
            return;
        }

        let customer = customers[0];
        let currentBalance = customer.paymentAccount.currentBalance;
        let account = customer.account;
        console.log('update');
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
