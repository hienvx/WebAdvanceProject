const SHA256 = require("crypto-js/sha256");
const AssociatedBank = require("../../../secrets/associated-bank.json");

/** Body Example
 * {
 *      name_bank: "KiantoBank",
 *      code: "KAT",
 *      requestTime: 1589940146,
 *      signature: "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"
 * }
 */

const security = function (req, res, next) {
  const code = req.body.code;
  const name_bank = req.body.name_bank;
  const requestTime = req.body.requestTime;
  const signature = req.body.signature;

  //Bank request have added in list?
  if (!AssociatedBank[code] || AssociatedBank[code].name !== name_bank)
    return res.status(403).send({
      status: 403,
      message: "Bank have not associated yet",
    });

  //Check out of date Default: 10s
  if (Date.now().valueOf() - requestTime > 10000)
    return res.status(403).send({
      status: 403,
      message: "Request is out of date",
    });

  //Validate signature
  if (
    SHA256(
      req.body + requestTime + AssociatedBank[code].secretKey
    ).toString() !== signature
  )
    return res.status(403).send({ status: 403, message: "Signature is wrong" });

  return next();
};
module.exports = { security };
