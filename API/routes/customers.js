let DB = require("../scripts/db");
let express = require("express");
let router = express.Router();
const moment = require("moment");
const fetch = require("isomorphic-fetch");
const authMiddleWare = require("../scripts/AuthMiddleware");
const bcrypt = require("bcrypt");
const db = require("../scripts/db");
const jwtHelper = require("../scripts/jwt.helper");
const AssociatedBank = require("../secrets/associated-bank.json");

const AuthMiddleWare = require("../scripts/AuthMiddleware");

let code = "KAT";

// Thời gian sống của access-token
const accessTokenLife = "1h";

const accessTokenSecret = AssociatedBank[code].secretKey;

// Thời gian sống của refreshToken
const refreshTokenLife = "3650d";

const refreshTokenSecret = AssociatedBank[code].secretKey;

/**
 * controller login
 * @param {*} req
 * @param {*} res
 */
const login = async (req, res) => {
  try {
    const userData = {
      account: req.body.account,
    };

    const userLogin = await db.Find("customers", { account: userData.account });
    if (userLogin.length > 0) {
      let hash = userLogin[0].pass;
      let loginSuccess = bcrypt.compareSync(req.body.pass, hash); // true
      if (!loginSuccess) {
        return res
          .status(200)
          .json({ message: "Password Incorrect", status: false });
      }
    } else {
      return res.status(200).json({ message: "User invalid", status: false });
    }

    const accessToken = await jwtHelper.generateToken(
      userData,
      accessTokenSecret,
      accessTokenLife
    );

    const refreshToken = await jwtHelper.generateToken(
      userData,
      refreshTokenSecret,
      refreshTokenLife
    );
    const isUserHadToken = await db.Find("tokens", {
      account: userData.account,
    });
    if (isUserHadToken.length == 0) {
      await db.Insert("tokens", [
        { account: userData.account, accessToken, refreshToken },
      ]);
    } else {
      await db.Update(
        "tokens",
        { accessToken, refreshToken },
        { account: userData.account }
      );
    }
    //Check recaptcha
    const secret_key = "6LdY57UZAAAAAMHdn3E8ADE1RqhwdNqBfUmSoM1Z";
    const recaptchaToken = req.body.recaptchaToken;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${recaptchaToken}`;

    console.log(req.body);
    await fetch(url, {
      method: "post",
    })
      .then((response) => response.json())
      .then((google_response) => {
        if (!google_response.success)
          res.json({ message: "recaptcha is wrong", google_response });
        else
          return res
            .status(200)
            .json({ accessToken, refreshToken, status: true });
      });
  } catch (error) {
    console.log("login -> error", error);

    return res.status(500).json({ error, status: false });
  }
};

const saltRounds = 10;
let hashCode = function (str) {
  let hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

router.post("/", async function (req, res, next) {
  let isExistUser = await DB.Find("customers", { account: req.body.account });
  if (isExistUser.length > 0) {
    res.json({ status: false, message: "Account is used" });
    return false;
  }

  let date = moment();
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.pass, salt);
  let time = date.unix();
  let ret = await DB.Insert("customers", [
    {
      account: req.body.account,
      pass: hash,
      time: time,
      profile: {
        fullName: req.body.profile.fullName,
        email: req.body.profile.email,
        phone: req.body.profile.phone,
      },
      paymentAccount: {
        numberAccount: time.toString(),
        currentBalance: req.body.paymentAccount.currentBalance,
      },
      savingAccount: req.body.savingAccount,
    },
  ]);
  res.json({ status: ret, message: "" });
});

router.post("/login", login);

router.post("/loginWithoutRecaptcha", async (req, res, next) => {
  try {
    const userData = {
      account: req.body.account,
    };

    const userLogin = await db.Find("customers", { account: userData.account });
    if (userLogin.length > 0) {
      let hash = userLogin[0].pass;
      let loginSuccess = bcrypt.compareSync(req.body.pass, hash); // true
      if (!loginSuccess) {
        return res
          .status(200)
          .json({ message: "Password Incorrect", status: false });
      }
    } else {
      return res.status(200).json({ message: "User invalid", status: false });
    }

    const accessToken = await jwtHelper.generateToken(
      userData,
      accessTokenSecret,
      accessTokenLife
    );

    const refreshToken = await jwtHelper.generateToken(
      userData,
      refreshTokenSecret,
      refreshTokenLife
    );
    const isUserHadToken = await db.Find("tokens", {
      account: userData.account,
    });
    if (isUserHadToken.length == 0) {
      await db.Insert("tokens", [
        { account: userData.account, accessToken, refreshToken },
      ]);
    } else {
      await db.Update(
        "tokens",
        { accessToken, refreshToken },
        { account: userData.account }
      );
    }

    console.log(req.body);
    return res.status(200).json({ accessToken, refreshToken, status: true });
  } catch (error) {
    console.log("login -> error", error);

    return res.status(500).json({ error, status: false });
  }
});

router.get("/getUserDetail", async (req, res, next) => {
  // Lấy token được gửi lên từ phía client
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"];
  console.log("tokenFromClient", tokenFromClient);

  if (tokenFromClient) {
    // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );

      const userLogin = await db.Find("tokens", {
        account: decoded.data.account,
      });
      if (userLogin.length > 0) {
        if (tokenFromClient === userLogin[0].accessToken) {
          const userDetail = await db.Find("customers", {
            account: decoded.data.account,
          });
          return res.json({
            profile: userDetail[0].profile,
            paymentAccount: userDetail[0].paymentAccount,
            savingAccount: userDetail[0].savingAccount,
            contactList: userDetail[0].contactList || [],
            status: true,
          });
        } else {
          return res.status(200).json({
            message: "Token invalid",
            status: false,
          });
        }
      } else {
        return res.status(200).json({
          message: "User invalid",
          status: false,
        });
      }
      /*            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
                            req.jwtDecoded = decoded;

                            // Cho phép req đi tiếp sang controller.
                            next();*/
    } catch (error) {
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      return res.status(200).json({
        message: "Unauthorized.",
        status: false,
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: "No token provided.",
      status: false,
    });
  }
});

router.get("/getSavingAccounts", async (req, res, next) => {
  // Lấy token được gửi lên từ phía client
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (tokenFromClient) {
    // Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );

      const userLogin = await db.Find("tokens", {
        account: decoded.data.account,
      });
      if (userLogin.length > 0) {
        if (tokenFromClient === userLogin[0].accessToken) {
          const userDetail = await db.Find("customers", {
            account: decoded.data.account,
          });
          return res.json([...userDetail[0].savingAccount]);
        } else {
          return res.status(200).json({
            message: "Token invalid",
            status: false,
          });
        }
      } else {
        return res.status(200).json({
          message: "User invalid",
          status: false,
        });
      }
      /*            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
                            req.jwtDecoded = decoded;

                            // Cho phép req đi tiếp sang controller.
                            next();*/
    } catch (error) {
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      return res.status(200).json({
        message: "Unauthorized.",
        status: false,
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: "No token provided.",
      status: false,
    });
  }
});

const decodeUserToken = async (tokenFromClient, accessTokenSecret) => {
  try {
    // Thực hiện giải mã token xem có hợp lệ hay không?
    const decoded = await jwtHelper.verifyToken(
      tokenFromClient,
      accessTokenSecret
    );

    return decoded.data.account;
  } catch (error) {
    throw error;
  }
};

router.post(
  "/addSavingAccount",
  authMiddleWare.isAuthenticate,
  async (req, res, next) => {
    try {
      //Body
      // {
      //   "numberAccount": 1596099637,
      //   "typeSaving": 1, [1: "14 ngày - 0.2%/năm" , 2: "1 tháng - 3.7%/năm"", 3: "6 tháng: 4.4%/năm", 4:"12 tháng: 6.0%/năm" ]
      //   "amount": 10000,
      //   "typeReceiving": 1 [1:"Lãi nhập gốc"" , 2: "Lãi trả vào tài khoản tiền gửi khi đến hạn trả lãi"]
      // }

      if (!req.body.typeSaving)
        return res
          .status(500)
          .json({ status: 500, message: "typeSaving is required" });
      if (!req.body.amount)
        return res
          .status(500)
          .json({ status: 500, message: "amount is required" });
      if (!req.body.typeReceiving)
        return res
          .status(500)
          .json({ status: 500, message: "typeReceiving is required" });

      // Lấy token được gửi lên từ phía client
      const tokenFromClient =
        req.body.token || req.query.token || req.headers["x-access-token"];

      const account = await decodeUserToken(tokenFromClient, accessTokenSecret);
      const customers = await DB.Find("customers", { account: account });

      const customer = customers[0];

      //Create Saving Account
      if (req.body.amount > customer.paymentAccount.currentBalance)
        return res.status(500).json({
          status: 500,
          message: "Current balance have not enough money",
        });

      if (!customer.savingAccount.length) {
        await DB.Update(
          "customers",
          {
            "paymentAccount.currentBalance":
              parseInt(customer.paymentAccount.currentBalance) -
              req.body.amount,
            savingAccount: [
              {
                numberAccount: moment().unix(),
                typeSaving: req.body.typeSaving,
                typeReceiving: req.body.typeReceiving,
                currentBalance: req.body.amount,
              },
            ],
          },
          { account: customer.account }
        ).then((ok) => {
          console.log("ok", ok);
          if (!ok) throw Error("Fail");
        });
      } else {
        await DB.Update(
          "customers",
          {
            "paymentAccount.currentBalance":
              parseInt(customer.paymentAccount.currentBalance) -
              req.body.amount,
            savingAccount: [
              ...customer.savingAccount,
              {
                numberAccount: moment().unix(),
                typeSaving: req.body.typeSaving,
                typeReceiving: req.body.typeReceiving,
                currentBalance: req.body.amount,
              },
            ],
          },
          { account: customer.account }
        ).then((ok) => {
          console.log("ok", ok);
          if (!ok) throw Error("Fail");
        });
      }

      return res.json({ status: 200, message: "ok" });
    } catch (error) {
      console.error("error", error);
      return res.json({ error });
    }
  }
);

router.get("/getNumberAccount/:userName", async (req, res) => {
  let userAccount = req.params.userName;
  const customers = await DB.Find("customers", { account: userAccount });
  if (customers.length > 0) {
    res.send(customers[0].paymentAccount.numberAccount);
  } else {
    res.send({});
  }
});

router.post("/addcontact", async (req, res) => {
  const myNumberAccount = req.body.myNumberAccount;
  console.log("myNumberAccount", myNumberAccount);
  const numberAccount = req.body.numberAccount; //so tao khoan de add vao
  console.log("numberAccount", numberAccount);
  const name = req.body.name; // ten goi nho
  console.log("name", name);

  //validate
  if (!numberAccount)
    return res.status(500).json({ message: "numberAccount must be required" });
  if (!name) return res.status(500).json({ message: "name must be required" });
  if (!myNumberAccount)
    return res
      .status(500)
      .json({ message: "myNumberAccount must be required" });

  let customers = await DB.Find("customers", {
    "paymentAccount.numberAccount": myNumberAccount,
  });

  //process
  if (customers.length > 0) {
    if (customers[0].contactList) {
      let isExisted = false;
      let i = 0;
      for (i; i < customers[0].contactList.length; i++) {
        if (
          customers[0].contactList[i].numberAccount === numberAccount.toString()
        )
          isExisted = true;
      }
      if (isExisted)
        return res.status(500).json({ message: "numberAccount existed" });

      customers[0].contactList = [
        ...customers[0].contactList,
        { numberAccount: numberAccount, name: name },
      ];
    } else {
      customers[0].contactList = [{ numberAccount: numberAccount, name: name }];
    }

    await DB.Update(
      "customers",
      { ...customers[0] },
      { "paymentAccount.numberAccount": myNumberAccount }
    );

    res.json(customers[0].contactList);
  } else {
    res.json({});
  }
});

router.post("/updatecontact", async (req, res) => {
  try {
    const myNumberAccount = req.body.myNumberAccount;
    const numberAccount = req.body.numberAccount; //so tao khoan de add vao
    const name = req.body.name; // ten goi nho

    //validate
    if (!numberAccount)
      return res
        .status(500)
        .json({ message: "numberAccount must be required" });
    if (!name)
      return res.status(500).json({ message: "name must be required" });
    if (!myNumberAccount)
      return res
        .status(500)
        .json({ message: "myNumberAccount must be required" });

    let customers = await DB.Find("customers", {
      "paymentAccount.numberAccount": myNumberAccount,
    });

    if (!customers[0].contactList)
      return res.status(500).json({ message: "numberAccount is not found" });

    //process
    if (customers.length > 0) {
      let isExisted = false;
      let i = 0;
      for (i; i < customers[0].contactList.length; i++) {
        if (
          customers[0].contactList[i].numberAccount === numberAccount.toString()
        ) {
          isExisted = true;
          break;
        }
      }
      if (isExisted) {
        console.log("i", i);
        customers[0].contactList[i].name = name;
        await DB.Update(
          "customers",
          { ...customers[0] },
          { "paymentAccount.numberAccount": myNumberAccount }
        );

        res.json(customers[0].contactList);
      } else
        return res.status(500).json({ message: "numberAccount is not found" });
    } else {
      res.json({});
    }
  } catch (error) {
    console.error("error", error);
  }
});

router.post("/deletecontact", async (req, res) => {
  try {
    const myNumberAccount = req.body.myNumberAccount;
    console.log("myNumberAccount", myNumberAccount);
    const numberAccount = req.body.numberAccount; //so tao khoan de add vao
    console.log("numberAccount", numberAccount);

    //validate
    if (!numberAccount)
      return res
        .status(500)
        .json({ message: "numberAccount must be required" });
    if (!myNumberAccount)
      return res
        .status(500)
        .json({ message: "myNumberAccount must be required" });

    let customers = await DB.Find("customers", {
      "paymentAccount.numberAccount": myNumberAccount,
    });

    if (!customers[0].contactList)
      return res.status(500).json({ message: "numberAccount is not found" });

    //process
    if (customers.length > 0) {
      let isExisted = false;
      let i = 0;
      for (i; i < customers[0].contactList.length; i++) {
        if (
          customers[0].contactList[i].numberAccount === numberAccount.toString()
        ) {
          isExisted = true;
          break;
        }
      }
      if (isExisted) {
        console.log("i", i);
        customers[0].contactList = customers[0].contactList.slice(i + 1);
        console.log("customers[0].contactList", customers[0].contactList);
        await DB.Update(
          "customers",
          { ...customers[0] },
          { "paymentAccount.numberAccount": myNumberAccount }
        );

        res.json(customers[0].contactList);
      } else
        return res.status(500).json({ message: "numberAccount is not found" });
    } else {
      res.json({});
    }
  } catch (error) {
    console.error("error", error);
  }
});
module.exports = router;
