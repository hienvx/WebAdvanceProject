const fs = require("fs");
const publickey = fs.readFileSync("./secrets/pgp/publickey.gpg");
console.log(publickey.toString());
