const DB = require("../scripts/db");
const config = require("../scripts/config");
const express = require("express");
const router = express.Router();
const moment = require("moment");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const mustache = require("mustache");
const fs = require("fs");
const { Verify } = require("crypto");
var ObjectId = require("mongodb").ObjectId;

/** Body Example
 * {
 *      "customer_payment_id": "1592378321", // Số tài khoản người chuyển. (DB.customers)paymentAccount.numberAccount
 *      "target_transfer_id": "1592387043", // Số tài khoản người nhận. (DB.customers)paymentAccount.numberAccount
 *      "target_transfer_name": "Phạm Nhựt Danh", // Tên người người nhận. (DB.customers)profile.fullName
 *      "transfer_amount": 2000000, // Số tiền chuyển
 *      "transfer_detail": "Chuyen tien" // Nội dung chuyển
 *      "fee_payer": 0 // Hình thức thanh toán phí. "0": Người chuyển trả, "1": Người nhận trả
 * }
 */

router.post("/transfer-fund", async function (req, res, next) {
  const customer_payment_id = req.body.customer_payment_id; // Số tài khoản người chuyển
  const target_transfer_id = req.body.target_transfer_id; // Số tài khoản người nhận
  const target_transfer_name = req.body.target_transfer_id.toUpperCase(); // Tên người người nhận
  const transfer_amount = parseInt(req.body.transfer_amount); // Số tiền chuyển
  const transfer_detail = req.body.transfer_detail; // Nội dung chuyển
  const fee_payer = req.body.fee_payer; // Hình thức thanh toán phí

  let result;
  // Lấy thông tin người chuyển
  result = await DB.Find("customers", {
    "paymentAccount.numberAccount": customer_payment_id,
  });
  if (result.length == 0) {
    res.status(401).json({
      status: false,
      message: "Người dùng không tồn tại",
    });
    return;
  }
  const customer_info = result[0];

  // Lấy thông tin người nhận
  result = await DB.Find("customers", {
    "paymentAccount.numberAccount": target_transfer_id,
  });
  if (result.length == 0) {
    res.status(401).json({
      status: false,
      message: "Không tìm thấy người dùng",
    });
    return;
  }
  const target_transfer_info = result[0];

  // Kiểm tra số dư
  let currentBalance = parseInt(customer_info.paymentAccount.currentBalance);
  let overBalance = currentBalance - transfer_amount;
  if (overBalance < 50000) {
    return res
      .status(401)
      .json({ status: false, message: "Số dư tài khoản không đủ" });
  }

  /** Otp sample
   * {
   * 		"customer_payment_id": "1592378321",
   * 		"target_transfer_id": "1592387043",
   * 		"transfer_amount": 2000000,
   * 		"transfer_detail": "Chuyen tien",
   * 		"otp": "123456",
   * 		"fee_payer": 0 // "0": người chuyển trả, "1": người nhận trả
   * 		"status": false // false: pending, true: success/cancel
   * 		"time": 1592207559,
   * }
   */

  // Lưu vào bảng OTP
  let stringOTP = randomstring.generate({ length: 6, charset: "numeric" });
  let otp = {
    customer_payment_id: customer_info.paymentAccount.numberAccount,
    target_transfer_id: target_transfer_info.paymentAccount.numberAccount,
    target_transfer_name: target_transfer_info.profile.fullName,
    transfer_amount: transfer_amount,
    transfer_detail: transfer_detail,
    otp: stringOTP,
    fee_payer: fee_payer,
    status: false,
    time: moment().unix(),
  };

  result = await DB.InsertReturnId("otp", [otp]);
  if (result.length == 0) {
    res.status(401).json({
      status: false,
      message: "Đã có lỗi trong quá trình xử lý. Vui lòng thử lại.",
    });
    return;
  }
  const otp_id = result;

  // Gửi mail cho người trả
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.bankmail,
      pass: config.bankmailpassword,
    },
  });

  let templateOtp = fs.readFileSync("./template/otp.html", "utf8");
  let htmlOtp = mustache.render(templateOtp, {
    otp: stringOTP,
    name: customer_info.profile.fullName,
  });
  let mailOptions = {
    from: "no-reply@verify.banknhom42.com",
    to: customer_info.profile.email,
    subject: "Nhom42Bank verification!",
    html: htmlOtp,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(401).json({
        status: false,
        message: "Đã có lỗi trong quá trình xử lý. Vui lòng thử lại.",
      });
      return;
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.status(200).json({
    status: true,
    otp_id: otp_id,
  });
});

router.post("/KAT/transfer-fund", async function (req, res, next) {
  const customer_payment_id = req.body.customer_payment_id; // Số tài khoản người chuyển
  const target_transfer_id = req.body.target_transfer_id; // Số tài khoản người nhận
  const target_transfer_name = req.body.target_transfer_name; // Tên người người nhận
  const transfer_amount = parseInt(req.body.transfer_amount); // Số tiền chuyển
  const transfer_detail = req.body.transfer_detail; // Nội dung chuyển
  const fee_payer = req.body.fee_payer; // Hình thức thanh toán phí

  let result;
  // Lấy thông tin người chuyển
  result = await DB.Find("customers", {
    "paymentAccount.numberAccount": customer_payment_id,
  });
  if (result.length == 0) {
    res.status(401).json({
      status: false,
      message: "Người dùng không tồn tại",
    });
    return;
  }
  const customer_info = result[0];

  // Lấy thông tin người nhận
  const target_transfer_info = {
    paymentAccount: {
      numberAccount: target_transfer_id,
    },
    profile: {
      fullName: target_transfer_name,
    },
  };

  // Kiểm tra số dư
  let currentBalance = parseInt(customer_info.paymentAccount.currentBalance);
  let overBalance = currentBalance - transfer_amount;
  if (overBalance < 50000) {
    return res
      .status(401)
      .json({ status: false, message: "Số dư tài khoản không đủ" });
  }

  /** Otp sample
   * {
   * 		"customer_payment_id": "1592378321",
   * 		"target_transfer_id": "1592387043",
   * 		"transfer_amount": 2000000,
   * 		"transfer_detail": "Chuyen tien",
   * 		"otp": "123456",
   * 		"fee_payer": 0 // "0": người chuyển trả, "1": người nhận trả
   * 		"status": false // false: pending, true: success/cancel
   * 		"time": 1592207559,
   * }
   */

  // Lưu vào bảng OTP
  let stringOTP = randomstring.generate({ length: 6, charset: "numeric" });
  let transfer_fee;
  if (fee_payer == 0) {
    transfer_fee = parseInt(config.transfer_fee);
  } else {
    transfer_fee = 0;
  }
  let otp = {
    customer_payment_id: customer_info.paymentAccount.numberAccount,
    target_transfer_id: target_transfer_info.paymentAccount.numberAccount,
    target_transfer_name: target_transfer_info.profile.fullName,
    target_transfer_bank: req.body.target_transfer_bank || "N42",
    transfer_amount: transfer_amount + transfer_fee,
    transfer_detail: transfer_detail,
    otp: stringOTP,
    fee_payer: fee_payer,
    status: false,
    time: moment().unix(),
  };

  result = await DB.InsertReturnId("otp", [otp]);
  if (result.length == 0) {
    res.status(401).json({
      status: false,
      message: "Đã có lỗi trong quá trình xử lý. Vui lòng thử lại.",
    });
    return;
  }
  const otp_id = result;

  // Gửi mail cho người trả
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.bankmail,
      pass: config.bankmailpassword,
    },
  });

  let templateOtp = fs.readFileSync("./template/otp.html", "utf8");
  let htmlOtp = mustache.render(templateOtp, {
    otp: stringOTP,
    name: customer_info.profile.fullName,
  });
  let mailOptions = {
    from: "no-reply@verify.banknhom42.com",
    to: customer_info.profile.email,
    subject: "Nhom42Bank verification!",
    html: htmlOtp,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(401).json({
        status: false,
        message: "Đã có lỗi trong quá trình xử lý. Vui lòng thử lại.",
      });
      return;
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.status(200).json({
    status: true,
    otp_id: otp_id,
  });
});

router.get("/get-otp-detail/:otpId", async function (req, res, next) {
  const otpId = req.params.otpId;

  // Get otp info by otp._id
  let objOtpId = new ObjectId(otpId);
  const otp_info = await DB.Find("otp", { _id: objOtpId });
  if (otp_info.length == 0) {
    res.status(401).json({
      status: false,
      message: "Không tồn tại Giao dịch",
    });
    return;
  }

  let result = otp_info[0];

  res.status(200).json({ status: true, message: "", data: result });
});

const verifyOTP = async (otp_info, otp) => {
  // Kiểm tra status của otp. true: đã sử dụng, false: chưa sử dụng
  if (otp_info.status == true) {
    res.status(401).json({
      status: false,
      message: "Mã OTP không khả dụng",
    });
    return;
  }

  // Kiểm tra thời hạn của otp: 10p
  const curTime = moment().unix();
  if (curTime - otp_info.time > 600) {
    res.status(401).json({
      status: false,
      message: "Mã OTP đã hết hạn",
    });
    return;
  }

  // So sánh mã otp
  if (otp != otp_info.otp) {
    res.status(401).json({
      status: false,
      message: "Mã OTP không đúng",
    });
    return;
  }

  // Cập nhật lại status = true
  let data = { status: true };
  let objOtpId = new ObjectId(otp_info._id);
  result = await DB.Update("otp", data, { _id: objOtpId });
  if (!result) {
    res.status(401).json({
      status: false,
      message: "Đã có lỗi trong quá trình xử lý",
    });
    return;
  }
};

router.post("/confirm-tranfer", async function (req, res, next) {
  const otpId = req.body.otpId;
  const otp = req.body.otp;
  let result;

  // Lấy thông tin otp
  let objOtpId = new ObjectId(otpId);
  result = await DB.Find("otp", { _id: objOtpId });
  if (result.length == 0) {
    res.status(401).json({
      status: false,
      message: "Không tồn tại Giao dịch",
    });
    return;
  }
  const otp_info = result[0];

  // Xác minh OTP
  verifyOTP(otp_info, otp);

  // Lấy thông tin người chuyển
  result = await DB.Find("customers", {
    "paymentAccount.numberAccount": otp_info.customer_payment_id,
  });
  let transfer = result;
  if (result.length == 0) {
    res.status(401).json({
      status: false,
      message: "Người dùng không tồn tại",
    });
    return;
  }
  const customer_info = result[0];

  // Kiểm tra số dư
  const curBal = parseInt(customer_info.paymentAccount.currentBalance);
  const paidRemain = curBal - parseInt(otp_info.transfer_amount);
  if (curBal < 50000 || paidRemain < 50000) {
    res.status(401).json({
      status: false,
      message: "Số dư không đủ",
    });
    return;
  }

  // Lấy phí giao dịch
  let transfer_fee;
  if (otp_info.fee_payer == 0) {
    transfer_fee = parseInt(config.transfer_fee);
  } else {
    transfer_fee = 0;
  }

  // Trừ tiền
  data = {
    paymentAccount: {
      numberAccount: customer_info.paymentAccount.numberAccount,
      currentBalance: paidRemain + transfer_fee,
    },
  };
  result = await DB.Update("customers", data, {
    "paymentAccount.numberAccount": otp_info.customer_payment_id,
  });

  if (
    otp_info.target_transfer_bank !== "KAT" &&
    otp_info.target_transfer_bank !== "TCK"
  ) {
    // Lấy thông tin người hưởng
    result = await DB.Find("customers", {
      "paymentAccount.numberAccount": otp_info.target_transfer_id,
    });
    if (result.length == 0) {
      res.status(401).json({
        status: false,
        message: "Không tìm thấy người nhận",
      });
      return;
    }
    const target_transfer_info = result[0];

    // Chuyển tiền
    const balance =
      parseInt(target_transfer_info.paymentAccount.currentBalance) +
      parseInt(otp_info.transfer_amount);
    data = {
      paymentAccount: {
        numberAccount: target_transfer_info.paymentAccount.numberAccount,
        currentBalance: balance,
      },
    };
    result = await DB.Update("customers", data, {
      "paymentAccount.numberAccount": otp_info.target_transfer_id,
    });
  }

  let log = {
    account: customer_info.paymentAccount.numberAccount,
    amount: String(otp_info.transfer_amount),
    type: 0, // "Nạp tiền" : ["Chuyển khoản", "Nạp tiền", "Rút tiền", "Nhận tiền"]
    performer: {
      type: "customer",
      account: customer_info.paymentAccount.numberAccount,
    },
    bank: otp_info.target_transfer_bank || "N42",
    time: moment().unix(),
  };
  await DB.Insert("transaction_history", [log]);
  res.status(200).json({ status: result, message: "Giao dịch thành công" });
});

module.exports = router;
