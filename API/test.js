const crypto = require("crypto");
const axios = require("axios");

const timestamp = Date.now();
const secret = "HjvV0rNq1GOvnPZmNaF3";

const dataToHash = timestamp + secret + "{}";
let hashString = crypto
  .createHash("sha256")
  .update(dataToHash)
  .digest("base64");

axios
  .get(
    "http://bank-backend.khuedoan.com/api/partner/get-account-info?credit_number=565572661049",
    {
      headers: {
        "partner-code": "N42",
        timestamp: timestamp,
        "authen-hash": hashString,
      },
    }
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error.response.data);
  });
