const DB = require('../scripts/db');
const config = require('../scripts/config');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');
const { route } = require('./accounts');

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

router.post('/transfer-fund', async function (req, res, next) {
	const customer_payment_id = req.body.customer_payment_id; // Số tài khoản người chuyển
	const target_transfer_id = req.body.target_transfer_id; // Số tài khoản người nhận
	const target_transfer_name = req.body.target_transfer_id.toUpperCase(); // Tên người người nhận
	const transfer_amount = parseInt(req.body.transfer_amount); // Số tiền chuyển
	const transfer_detail = req.body.transfer_detail; // Nội dung chuyển
	const fee_payer = req.body.fee_payer; // Hình thức thanh toán phí

	let result;
	// Lấy thông tin người chuyển
	result = await DB.Find('customers', {
		'paymentAccount.numberAccount': customer_payment_id,
	});
	if (result.length == 0) {
		res.status(false).json({ message: 'Người dùng không tồn tại' });
		return;
	}
	const customer_info = result[0];

	// Lấy thông tin người nhận
	result = await DB.Find('customers', {
		'paymentAccount.numberAccount': target_transfer_id,
	});
	if (result.length == 0) {
		res.status(false).json({ message: 'Không tìm thấy người dùng' });
		return;
	}
	const target_transfer_info = result[0];

	// Kiểm tra số dư
	let currentBalance = parseInt(customer_info.paymentAccount.currentBalance);
	let overBalance = currentBalance - transfer_amount;
	if (overBalance < 50000) {
		return res.status(false).json({ message: 'Số dư tài khoản không đủ' });
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
	let stringOTP = randomstring.generate({ length: 6, charset: 'numeric' });
	let transfer_fee;
	if (fee_payer == 0) {
		transfer_fee = parseInt(config.transfer_fee);
	} else {
		transfer_fee = 0;
	}
	let otp = {
		customer_payment_id: customer_info.paymentAccount.numberAccount,
		target_transfer_id: target_transfer_info.paymentAccount.numberAccount,
		transfer_amount: transfer_amount + transfer_fee,
		transfer_detail: transfer_detail,
		otp: stringOTP,
		fee_payer: fee_payer,
		status: false,
		time: moment().unix(),
	};

	result = await DB.InsertReturnId('otp', [otp]);
	if (result.length == 0) {
		res.status(false).json({
			message: 'Đã có lỗi trong quá trình xử lý. Vui lòng thử lại.',
		});
		return;
	}
	const otp_id = result;
	
	// Gửi mail cho người trả
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: config.bankmail,
			pass: config.bankmailpassword,
		},
	});

	let templateOtp = fs.readFileSync('./template/otp.html', 'utf8');
	let htmlOtp = mustache.render(templateOtp, {
		otp: stringOTP,
		name: customer_info.profile.fullName,
	});
	let mailOptions = {
		from: 'no-reply@verify.banknhom42.com',
		// to: target_transfer_info.profile.email,
		to: 'vxhien96@gmail.com',
		subject: 'Nhom42Bank verification!',
		html: htmlOtp,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			res.status(false).json({
				message: 'Đã có lỗi trong quá trình xử lý. Vui lòng thử lại.',
			});
			return;
		}
		else {
			console.log('Email sent: ' + info.response);
		}
	});

	res.status(true).json({ otp_id: otp_id });
});

// route.post('/verify-otp', async function (req, res, next) {
	
// });

module.exports = router;
