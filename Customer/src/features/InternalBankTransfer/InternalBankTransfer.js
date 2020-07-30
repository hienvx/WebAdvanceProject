import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	transferModel,
	updateValue,
	doGetTargetNumberAccountThunk,
	doGetUserInfoThunk,
	doTransfer,
} from './InternalBankTransferSlice';

import 'icheck-material/icheck-material.min.css';

export function InternalBankTransfer(props) {
	const dispatch = useDispatch();
	const transfer = useSelector(transferModel);
	let timer;

	if (transfer.isStart) {
		dispatch(doGetUserInfoThunk());
	}

	return (
		<div className="card text-left" hidden={props.hidden}>
			<div className="card-header text-center">
				<h3>CHUYỂN TIỀN CHO NGƯỜI HƯỞNG TẠI VIETCOMBANK</h3>
			</div>
			<form action="#">
				<div className="card-header">THÔNG TIN NGƯỜI CHUYỂN</div>
				<div className="form-group">
					<div className="card-body">
						<label className="col-3">Tài khoản nguồn</label>
						<b className="col-3">{transfer.userNumberAccount}</b>
					</div>
					<div className="card-body">
						<label className="col-3">Số dư khả dụng</label>
						<b className="col-3">{transfer.currentBalance}</b>VND
					</div>
				</div>

				<div className="card-header">THÔNG TIN NGƯỜI HƯỞNG</div>
				<div className="form-group">
					<div className="card-body">
						<label>Tài khoản người hưởng</label>
						<input
							type="text"
							className="form-control"
							onChange={(e) => {
								let filter = {
									value: e.target.value,
									option: ['targetNumberAccount'],
								};
								clearTimeout(timer);
								let ms = 1000; // milliseconds
								timer = setTimeout(function () {
									dispatch(updateValue(filter));
									dispatch(doGetTargetNumberAccountThunk());
								}, ms);
							}}
							placeholder="Nhập Số tài khoản"
						/>
					</div>
					<div className="card-body">
						<label className="col-3">Tên người hưởng: </label>
						<b className="col-3">{transfer.targetFullName}</b>
					</div>
					{/* <div className="card-body">
							<label>Lưu thông tin người hưởng</label>
							<input type="checkbox" className="form-control" />
						</div> */}
				</div>

				<div className="card-header">THÔNG TIN GIAO DỊCH</div>
				<div className="form-group">
					<div className="card-body">
						<label>Số tiền chuyển</label>
						<input
							type="number"
							className="form-control"
							onChange={(e) => {
								dispatch(
									updateValue({
										value: e.target.value,
										option: ['amount'],
									})
								);
							}}
							placeholder="Nhập Số tiền VND"
						/>
					</div>
					<div className="card-body">
						<label>Nội dung chuyển tiền</label>
						<input
							type="text"
							className="form-control"
							onChange={(e) => {
								dispatch(
									updateValue({
										value: e.target.value,
										option: ['detail'],
									})
								);
							}}
							placeholder="Nhập Nội dung chuyển tiền"
						/>
					</div>
					<div className="card-body">
						<div className="form-check col-4 icheck-material-blue">
							<input
								type="radio"
								className="form-check-input"
								id="self"
								name="feePayer"
								onClick={() => {
									dispatch(
										updateValue({
											value: 0,
											option: ['feePayer'],
										})
									);
								}}
								onChange={() => {}}
								checked={transfer.feePayer === 0}
							/>
							<label className="form-check-label" htmlFor="self">
								Người chuyển trả
							</label>
						</div>
						<div className="form-check col-4 icheck-material-blue">
							<input
								type="radio"
								className="form-check-input"
								id="them"
								name="feePayer"
								onClick={() => {
									dispatch(
										updateValue({
											value: 1,
											option: ['feePayer'],
										})
									);
								}}
								onChange={() => {}}
								checked={transfer.feePayer === 1}
							/>
							<label className="form-check-label" htmlFor="them">
								Người nhận trả
							</label>
						</div>
					</div>
				</div>
			</form>
			<button
				type="button"
				className="btn btn-primary"
				onClick={async () => {
					dispatch(doTransfer());
				}}>
				<span>Xác nhận</span>
				<span
					hidden={!transfer.isLoading}
					className="spinner-border text-dark"></span>
			</button>
		</div>
	);
}
