const security = require("./securityAPI");
const axios = require("axios");
const SHA256 = require("crypto-js/sha256");
const AssociatedBank = require("../secrets/associated-bank.json");

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
    const headers = {
      code: "KAT",
      "request-time": Date.now(),
    };

    const data = {};

    await client
      .get("/api/interbank/get-account-info?number=1593765471", {
        headers: {
          ...headers,
          "auth-hash": SHA256(
            data +
              headers["request-time"] +
              AssociatedBank[headers.code].secretKey
          ).toString(),
          timeout: 30000,
        },
      })
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        console.log("err", err);
        throw new Error(JSON.stringify(err.response.data));
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
    const headers = {
      code: "tckbank",
      "request-time": Date.now(),
    };

    const data = {};

    await client
      .get("/api/interbank/get-account-info?number=1593765471", {
        headers: {
          ...headers,
          "auth-hash": SHA256(
            data +
              headers["request-time"] +
              AssociatedBank[headers.code].secretKey
          ).toString(),
          timeout: 30000,
        },
      })
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        console.log("err", err);
        throw new Error(JSON.stringify(err.response.data));
      });
  });
});
