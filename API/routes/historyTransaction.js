let DB = require("../scripts/db");
let express = require("express");
let router = express.Router();

router.post("/", async function (req, res, next) {
    /*let date = moment();
    await DB.Insert("transaction_history", [
        {account: "nhutthanh340", type: 1, amount: "3000", time: date.unix(), bank: "ACB", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh341", type: 2, amount: "5000", time: date.unix(), bank: "Sacombank", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh432", type: 0, amount: "7000", time: date.unix(), bank: "ACB", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh343", type: 2, amount: "3000", time: date.unix(), bank: "Viettin", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh344", type: 2, amount: "9000", time: date.unix(), bank: "ACB", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh345", type: 0, amount: "5000", time: date.unix(), bank: "Viettin", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh344", type: 1, amount: "4000", time: date.unix(), bank: "Viettin", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh343", type: 1, amount: "7000", time: date.unix(), bank: "ACB", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh342", type: 0, amount: "2000", time: date.unix(), bank: "Sacombank", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh341", type: 1, amount: "6000", time: date.unix(), bank: "Viettin", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh340", type: 2, amount: "8000", time: date.unix(), bank: "ACB", performer:{type:"employee", account:"employee1"}},
        {account: "nhutthanh345", type: 0, amount: "9000", time: date.unix(), bank: "Sacombank", performer:{type:"employee", account:"employee1"}}
    ]);
    res.json({"ok":true});*/
    /*    req.body.condition = {account: "nhutthanh340"}
        req.body.sort = {"time": -1}*/

    let results = await DB.Find("transaction_history", req.body.condition, req.body.sort, req.body.limit, req.body.skip);
    let total = await DB.Find("transaction_history", req.body.condition, req.body.sort).then(result=>result.length);
    res.json({results, total:total});

});

module.exports = router;