let DB = require("../scripts/db");
let express = require("express");
let router = express.Router();
const moment = require("moment");

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/", async function (req, res, next) {

    let isExistUser = await DB.Find("employees", {account: req.body.account});
    if (isExistUser.length > 0) {
        res.json({"status": false, "message": "Account is used"});
        return false;
    }

    let date = moment();
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.pass, salt);

    let ret = await DB.Insert("employees", [
        {
            account: req.body.account,
            pass: hash,
            time: date.unix(),
            profile:
                {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    phone: req.body.phone
                }
        }
    ]);
    res.json({"status": ret, "message": ""});
});

router.put("/", async function (req, res, next) {

    let isExistUser = await DB.Find("employees", {account: req.body.account});
    if (isExistUser.length == 0) {
        res.json({"status": false, "message": "Account is not exist"});
        return false;
    }

    let date = moment();
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.pass, salt);

    let ret = await DB.Update("employees",
        {
            pass: hash,
            time: date.unix(),
            profile:
                {
                    fullName: req.body.fullName,
                    email: req.body.email,
                    phone: req.body.phone
                }
        },
        {account: req.body.account}
    );
    res.json({"status": ret, "message": ""});
});

router.post("/delete", async function (req, res, next) {

    let isExistUser = await DB.Find("employees", {account: req.body.account});
    if (isExistUser.length == 0) {
        res.json({"status": false, "message": "Account is not exist"});
        return false;
    }

    let ret = await DB.Delete("employees",
        {account: req.body.account}
    );
    res.json({"status": ret, "message": ""});
});

router.post("/query", async function (req, res, next) {

    let results = await DB.Find("employees", req.body.condition, req.body.sort, req.body.limit, req.body.skip);
    let total = await DB.Find("employees", req.body.condition, req.body.sort).then(result=>result.length);
    res.json({results, total});
});

module.exports = router;