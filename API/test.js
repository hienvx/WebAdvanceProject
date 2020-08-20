const axios = require("axios");
const MD5 = require("crypto-js/md5");
const SHA256 = require("crypto-js/sha256");
const openpgp = require("openpgp");
const fs = require("fs");

const signPGP = async () => {
  const privateKeyArmored = fs.readFileSync("./secrets/pgp/privatekey.gpg"); //file privatekey path
  const passphrase = fs.readFileSync("./secrets/pgp/passphrase.txt"); // file passphrase path

  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(privateKeyArmored);
  await privateKey.decrypt(passphrase);

  const { signature: detachedSignature } = await openpgp.sign({
    message: openpgp.cleartext.fromText("Hello, World!"), // CleartextMessage or Message object
    privateKeys: [privateKey], // for signing
    detached: true,
  });
  return detachedSignature; // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
};

const deposit = async () => {
  const pgp_sig = (await signPGP()).toString();
  const headers = {
    code: "tckbank", //code bank
    "request-time": Date.now(),
  };

  const data = {};
  try {
    const response = await axios.get(
      "http://localhost:3000/api/interbank/get-account-info?number=1593765471",
      {
        headers: {
          ...headers,
          "auth-hash": SHA256(
            data + headers["request-time"] + "tck@bank"
          ).toString(),
        },
      }
    );
    console.log("deposit -> response.data", response.data);
    return response.data;
  } catch (error) {
    console.log("deposit -> error.response.data", error.response.data);
    return error.response.data;
  }
};

console.log(SHA256({} + 1597854743555 + "_(5KmP*YcTM(@?:").toString());
