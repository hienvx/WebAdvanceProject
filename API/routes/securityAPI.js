const SHA256 = require("crypto-js/sha256");
const AssociatedBank = require("../secrets/associated-bank.json");

/** Body Example
 * {
 *      "name_bank": "KiantoBank", // Partner name (Ten ngan hang)
 *      "code": "KAT", // Partner code
 *      "data": {
 *        // req.body.data
 *      },
 *      "requestTime": 1589940146, // Thoi gian con song cua package. Mac dinh 10s
 *      "signature": "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ" // Ma hoa SHA256(body.json + requestTime + secretkey)
 *      "pgp_sig": "-----BEGIN PGP SIGNED MESSAGE-----...-----END PGP SIGNATURE-----" // Chu ky ma ben B ky bang privateKey(PGP) cua ho
 * }
 */

const security = function (req, res, next) {
  const code = req.headers.code;
  const requestTime = req.headers["request-time"];
  const auth_hash = req.headers["auth-hash"];

  //Bank request have added in list?
  if (!AssociatedBank[code])
    return res.status(403).send({
      status: 403,
      message: "bank have not associated yet",
    });

  //Check out of date Default: 30s
  if (Date.now().valueOf() - requestTime > 30000)
    return res.status(403).send({
      status: 403,
      message: "request is out of date",
    });

  //Check original package
  console.log(
    SHA256(req.body + requestTime + AssociatedBank[code].secretKey).toString()
  );
  if (
    SHA256(
      req.body + requestTime + AssociatedBank[code].secretKey
    ).toString() !== auth_hash
  )
    return res.status(403).send({ status: 403, message: "auth-hash is wrong" });

  return next();
};
module.exports = { security };
