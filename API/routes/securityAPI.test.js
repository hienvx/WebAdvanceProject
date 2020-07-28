const security = require("./securityAPI");
const axios = require("axios");
const SHA256 = require("crypto-js/sha256");
const AssociatedBank = require("../secrets/associated-bank.json");

/**
 * describe is jest specific function
 * name of the object as string for which the test is written
 * function that will define a series of tests
 */
describe("security", () => {
  const host = process.env.HOST || "https://localhost:3000";
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
      name_bank: "Kianto Bank",
      code: "KAT",
      data: {},
      requestTime: Date.now(),
    };

    const data = {};

    await client
      .post(
        "/test-security-api",
        {
          headers: {
            ...headers,
            signature: SHA256(
              headers +
                headers.requestTime +
                AssociatedBank[headers.code].secretKey
            ).toString(),
          },
        },
        {
          ...data,
        }
      )
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        throw new Error(JSON.stringify(err.response));
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
      client.post("/test-security-api", {
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
      client.post("/test-security-api", {
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
