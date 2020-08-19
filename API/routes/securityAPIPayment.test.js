const security = require("./securityAPI");
const axios = require("axios");
const SHA256 = require("crypto-js/sha256");
const fs = require("fs");
const openpgp = require("openpgp");
const AssociatedBank = require("../secrets/associated-bank.json");

jest.setTimeout(30000);

const signPGP = async (bankCode) => {
  const privateKeyArmored = fs.readFileSync(
    bankCode === "KAT"
      ? "./secrets/pgp/privatekey-signature-KAT.gpg"
      : "./secrets/pgp/privatekey-signature-TCK.gpg"
  );
  const passphrase = fs.readFileSync(
    bankCode === "KAT"
      ? "./secrets/pgp/passphrase.txt"
      : "./secrets/pgp/passphraseTCK.txt"
  ); // what the private key is encrypted with

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
describe("security for KAT", () => {
  const host = process.env.HOST || "https://nhom42bank.herokuapp.com/";

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
    const pgp_sig = (await signPGP("KAT")).toString();
    const headers = {
      code: "KAT",
      "request-time": Date.now(),
    };

    const data = {
      numberAccount: 1593765471,
      amount: 1000,
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
          timeout: 30000,
        }
      )
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err.response));
      });
  });
});

describe("security for TCK", () => {
  const host = process.env.HOST || "https://nhom42bank.herokuapp.com/";
  const secret_key = AssociatedBank["tckbank"].secretKey;

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
    const pgp_sig = (await signPGP("tckbank")).toString();
    const headers = {
      code: "tckbank",
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
          timeout: 30000,
        }
      )
      .then((res) => {
        console.log("res", res.data);
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err.response));
      });
  });
});
