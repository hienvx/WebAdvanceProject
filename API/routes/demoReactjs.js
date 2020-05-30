var express = require('express');
var router = express.Router();
let DB = require('../scripts/db');

//handler get home
router.get('/', function (req, res, next) {
    res.render('demo_reactjs');
});

router.post('/getAcc', async function (req, res, next) {
    let customers = await DB.Find("administrators", {});
    console.log(customers);
    res.json(customers);
});

module.exports = router;