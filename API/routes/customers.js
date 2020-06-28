let DB = require("../scripts/db");
let express = require("express");
let router = express.Router();
const moment = require("moment");

const bcrypt = require('bcrypt');
const saltRounds = 10;

let hashCode = function (str) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

router.post("/", async function (req, res, next) {

    let isExistUser = await DB.Find("customers", {account: req.body.account});
    if (isExistUser.length > 0) {
        res.json({"status": false, "message": "Account is used"});
        return false;
    }

    let date = moment();
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.pass, salt);
    let time = date.unix();
    let ret = await DB.Insert("customers", [
        {
            account: req.body.account,
            pass: hash,
            time: time,
            profile:
                {
                    fullName: req.body.profile.fullName,
                    email: req.body.profile.email,
                    phone: req.body.profile.phone
                },
            paymentAccount: {
                numberAccount: time.toString(),
                currentBalance: req.body.paymentAccount.currentBalance
            },
            savingAccount: req.body.savingAccount
        }
    ]);
    res.json({"status": ret, "message": ""});
});


module.exports = router;