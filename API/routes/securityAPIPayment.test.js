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

  const { data: cleartext } = await openpgp.sign({
    message: openpgp.cleartext.fromText("Hello, World!"), // CleartextMessage or Message object
    privateKeys: [privateKey], // for signing
  });
  return cleartext; // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
};

/**
 * describe is jest specific function
 * name of the object as string for which the test is written
 * function that will define a series of tests
 */
describe("security", () => {
  const host = process.env.HOST || "https://localhost:3000";
  const secret_key = AssociatedBank["KAT"].secretKey;

  const client = axios.create({
    baseURL: "http://localhost:3000",
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
    const data = {
      name_bank: "Kianto Bank",
      code: "KAT",
      data: {},
      requestTime: Date.now(),
      pgp_sig: (await signPGP()).toString(),
    };

    await client
      .post("/test-security-api-payment", {
        ...data,
        signature: SHA256(
          data + data.requestTime + AssociatedBank[data.code].secretKey
        ).toString(),
      })
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err.response.data));
      });
  });

  it("It should return 403 when the bank have not assigned before", async () => {
    const data = {
      name_bank: "Kianto Bank wrong",
      code: "KAT",
      data: {},
      requestTime: Date.now(),
    };
    await expect(
      client.post("/test-security-api-payment", {
        ...data,
        signature: SHA256(
          data + data.requestTime + AssociatedBank[data.code].secretKey
        ).toString(),
      })
    ).rejects.toThrow(new Error("Request failed with status code 403"));
  });

  it("It should return 403 when the signature is wrong", async () => {
    const data = {
      name_bank: "Kianto Bank",
      code: "KAT",
      data: {},
      requestTime: Date.now(),
    };
    await expect(
      client.post("/test-security-api-payment", {
        ...data,
        signature: SHA256(
          data +
            data.requestTime +
            AssociatedBank[data.code].secretKey +
            "wrong"
        ).toString(),
      })
    ).rejects.toThrow(new Error("Request failed with status code 403"));
  });
});
