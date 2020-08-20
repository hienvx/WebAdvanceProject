import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	otpModel,
	updateValue,
	doGetOTPInfoThunk,
	doConfirm,
} from './VerifyOTPSlice';

export function VerifyOTP(props) {
	const dispatch = useDispatch();
	const otp = useSelector(otpModel);

	if (otp.isStart) {
		dispatch(doGetOTPInfoThunk());
	}

	return (
		<div className="card text-left">
			<div className="card-header text-center">
				<h3>XÁC NHẬN OTP</h3>
			</div>
			<form action="#">
				<div className="card-header">THÔNG TIN GIAO DỊCH</div>
				<div className="form-group">
					<div className="card-body">
						<label className="col-3">Ngày, giờ giao dịch</label>
						<b className="col-3">{otp.time}</b>
					</div>
					<div className="card-body">
						<label className="col-3">Tài khoản trích nợ</label>
						<b className="col-3">{otp.userNumberAccount}</b>
					</div>
					<div className="card-body">
						<label className="col-3">Tài khoản ghi có</label>
						<b className="col-3">{otp.targetNumberAccount}</b>
					</div>
					<div className="card-body">
						<label className="col-3">Tên người hưởng</label>
						<b className="col-3">{otp.targetName}</b>
					</div>
					<div className="card-body">
						<label className="col-3">Số tiền trích nợ</label>
						<b className="col-3">{otp.amount}</b>
					</div>
					<div className="card-body">
						<label className="col-3">Loại phí</label>
						<b className="col-3">
							{otp.feePayer === 0
								? 'Người chuyển trả'
								: 'Người nhận trả'}
						</b>
					</div>
					<div className="card-body">
						<label className="col-3">Nội dung chuyển tiền</label>
						<b className="col-3">{otp.detail}</b>
					</div>
				</div>

				<div className="card-header"></div>
				<div className="card-body">
					<label>Nhập mã OTP</label>
					<input
						type="text"
						className="form-control"
						onChange={(e) => {
							dispatch(
								updateValue({
									value: e.target.value,
									option: ['otp'],
								})
							);
						}}
					/>
				</div>
			</form>
			<button
				type="button"
				className="btn btn-primary"
				onClick={async () => {
					dispatch(doConfirm());
				}}>
				<span>Xác nhận</span>
				<span
					hidden={!otp.isLoading}
					className="spinner-border text-dark"></span>
			</button>
		</div>
	);
}
