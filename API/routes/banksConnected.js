let DB = require("../scripts/db");
let express = require("express");
let router = express.Router();
const moment = require("moment");

router.get("/", async function (req, res, next) {

    let results = await DB.Find("banks_connected");
    res.json(results);

});

module.exports = router;