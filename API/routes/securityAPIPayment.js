const openpgp = require("openpgp");
const SHA256 = require("crypto-js/sha256");
const AssociatedBank = require("../secrets/associated-bank.json");
const fs = require("fs");

// Check publickey
let publicKeyArmored = "";
// fs.readFile('packages/api/secrets/pgp/publickey-' + code + '.gpg', 'utf8', (err, data) => {
//   if (err)  throw Error("No public key")
//   publicKeyArmored = data;
// });
fs.readFile(
  "./secrets/pgp/publickey-signature-test.gpg",
  "utf8",
  (err, data) => {
    if (err) throw Error("No public key");
    publicKeyArmored = data;
  }
);

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

const securityPayment = async function (req, res, next) {
  const code = req.headers.code;
  const requestTime = req.headers["request-time"];
  const auth_hash = req.headers["auth-hash"];
  const pgp_sig = req.body.pgp_sig;
  console.log("pgp_sig", pgp_sig);

  // Check bank have been added in list
  if (!AssociatedBank[code])
    return res.status(403).send({
      status: 403,
      message: "Bank have not associated yet",
    });

  // Check out of date Default: 30s
  if (Date.now().valueOf() - requestTime > 30000)
    return res.status(403).send({
      status: 403,
      message: "Request is out of date",
    });

  // Check original package
  if (
    SHA256(
      req.body + requestTime + AssociatedBank[code].secretKey
    ).toString() !== auth_hash
  )
    return res.status(403).send({ status: 403, message: "auth-hash is wrong" });

  let publicKeys;
  try {
    signature = await openpgp.signature.readArmored(pgp_sig);
    publicKeys = await openpgp.key.readArmored(publicKeyArmored);
  } catch (err) {
    return res.status(403).send({
      status: 403,
      message: err.toString(),
    });
  }

  // Verify Asymmetric Signature
  const verified = await openpgp.verify({
    message: openpgp.cleartext.fromText("Hello, World!"),
    signature: signature,
    publicKeys: publicKeys.keys, // for verification
  });
  const { valid } = verified.signatures[0];
  if (valid) {
    console.log("Signed by key id " + verified.signatures[0].keyid.toHex());
  } else {
    return res.status(403).send({
      status: 403,
      message: "Signature could not be verified",
    });
  }

  return next();
};
module.exports = { securityPayment };
