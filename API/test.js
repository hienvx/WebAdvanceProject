const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");

function RSASign(privateKey, data) {
  const sign = crypto.createSign("RSA-SHA256");
  const signature = sign.update(data).sign(privateKey, "base64");
  console.log(signature);
  return signature;
}

const timestamp = Date.now();
const secret = "HjvV0rNq1GOvnPZmNaF3";
const dataToHash =
  timestamp + secret + '{"credit_number":"565572661049","amount":200000}';
const credit_number = 565572661049;

const privateKey = fs.readFileSync("./secrets/rsa/privatekey.rsa");
const signature = RSASign(privateKey, dataToHash);

let hashString = crypto
  .createHash("sha256")
  .update(dataToHash)
  .digest("base64");

axios
  .post(
    "http://bank-backend.khuedoan.com/api/partner/deposit",
    { credit_number: "565572661049", amount: 200000 },
    {
      headers: {
        "partner-code": "N42",
        timestamp: timestamp,
        "authen-hash": hashString.toString(),
        "authen-sig": signature.toString(),
      },
    }
  )
  .then((response) => {
    console.log("response", response.data);
  })
  .catch((error) => {
    console.log("error", error.response.data);
  });
