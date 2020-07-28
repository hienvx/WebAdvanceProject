const security = require("./securityAPI");
const axios = require("axios");
const SHA256 = require("crypto-js/sha256");
const fs = require("fs");
const openpgp = require("openpgp");
const AssociatedBank = require("../secrets/associated-bank.json");

const signPGP = async () => {
  const privateKeyArmored = fs.readFileSync(
    "./secrets/pgp/privatekey-signature-test.gpg"
  );
  const passphrase = fs.readFileSync("./secrets/pgp/passphrase.txt"); // what the private key is encrypted with

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

/**
 * describe is jest specific function
 * name of the object as string for which the test is written
 * function that will define a series of tests
 */
describe("security", () => {
  const host = process.env.HOST || "http://localhost:3000";
  const secret_key = AssociatedBank["KAT"].secretKey;

  const client = axios.create({
    baseURL: host,
  });
  /**
   * beforeEach allows us to run some code before
   * running any test
   * example creating an instance
   */
  beforeEach(() => {});
  /**
   * it function is used to write unit tests
   * first param is a description
   * second param is callback arrow function
   */
  it("It should return status 200 when request is correct", async () => {
    const pgp_sig = (await signPGP()).toString();
    const headers = {
      code: "KAT",
      "request-time": Date.now(),
    };

    const data = {
      numberAccount: 1593765471,
      amount: 100000,
    };

    await client
      .post(
        "/api/interbank/deposit",
        { ...data, pgp_sig: pgp_sig },
        {
          headers: {
            ...headers,
            "auth-hash": SHA256(
              data +
                headers["request-time"] +
                AssociatedBank[headers.code].secretKey
            ).toString(),
          },
        }
      )
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err.response.data));
      });
  });
});
