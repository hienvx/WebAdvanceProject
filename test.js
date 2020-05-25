const SHA256 = require("crypto-js/sha256");
const AssociatedBank = require("./secrets/associated-bank.json");

const bodyExample = {
  name_bank: "KiantoBank",
  code: "KAT",
  requestTime: 1589940146,
  signature:
    "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
};

console.log(Date.now());
