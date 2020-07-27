import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const axios = require('axios').default;

export const doGetUserInfoThunk = createAsyncThunk(
	'doGetUserInfoThunk',
	async (data, thunkAPI) => {
		thunkAPI.dispatch(updateValue({ value: false, option: ['isStart'] }));
		thunkAPI.dispatch(updateValue({ value: true, option: ['isLoading'] }));
		thunkAPI.dispatch(updateValue({ value: '', option: ['message'] }));

		const response = await getUserInfo(
			thunkAPI.getState().internalBankTransferSlice.userName
		);
		if (response.status) {
			thunkAPI.dispatch(
				updateValue({
					value: response.paymentAccount.numberAccount,
					option: ['userNumberAccount'],
				})
			);
			thunkAPI.dispatch(
				updateValue({
					value: response.paymentAccount.currentBalance,
					option: ['currentBalance'],
				})
			);
		} else {
			thunkAPI.dispatch(
				updateValue({ value: response.message, option: ['message'] })
			);
		}

		thunkAPI.dispatch(updateValue({ value: false, option: ['isLoading'] }));
	}
);

let getUserInfo = function (state) {
	return axios
		.get('http://localhost:3000/customers/getUserDetail/', {
			headers: {
				'x-access-token': localStorage.getItem(
					'accessToken_Employee_KAT'
				),
			},
		})
		.then((response) => {
			return response.data;
		})
		.catch(() => {
			return { status: false, message: 'An error occurred' };
		});
};

export const doGetTargetNumberAccountThunk = createAsyncThunk(
	'doGetTargetNumberAccountThunk',
	async (data, thunkAPI) => {
		thunkAPI.dispatch(updateValue({ value: true, option: ['isLoading'] }));
		thunkAPI.dispatch(updateValue({ value: '', option: ['message'] }));
		const response = await getNumberAccount(
			thunkAPI.getState().internalBankTransferSlice
		);
		if (response.status) {
			thunkAPI.dispatch(
				updateValue({
					value: response.data.profile.fullName,
					option: ['targetFullName'],
				})
			);
		} else {
			thunkAPI.dispatch(
				updateValue({ value: response.message, option: ['message'] })
			);
		}

		thunkAPI.dispatch(updateValue({ value: false, option: ['isLoading'] }));
	}
);

let getNumberAccount = async function (state) {
	return await axios
		.get(
			'http://localhost:3000/accounts/NumberAccount/' +
				state.targetNumberAccount
		)
		.then((response) => {
			return response.data;
		})
		.catch(() => {
			return { status: false, message: 'An error occurred' };
		});
};

export const doTransfer = createAsyncThunk(
	'doTransfer',
	async (data, thunkAPI) => {
		thunkAPI.dispatch(updateValue({ value: true, option: ['isLoading'] }));
		thunkAPI.dispatch(updateValue({ value: '', option: ['message'] }));
		const response = await paymentUserAccount(
			thunkAPI.getState().internalBankTransferSlice
		);
		if (response.status) {
			// Go to verify otp page
			localStorage.setItem('otp_id', response.otp_id);
			window.location = '/verifyOTP';
		} else {
			thunkAPI.dispatch(
				updateValue({ value: response.message, option: ['message'] })
			);
		}

		thunkAPI.dispatch(updateValue({ value: false, option: ['isLoading'] }));
	}
);

let paymentUserAccount = async function (state) {
	return await axios
		.post('http://localhost:3000/transfer/transfer-fund', {
			customer_payment_id: state.userNumberAccount, // Số tài khoản người chuyển
			target_transfer_id: state.targetNumberAccount, // Số tài khoản người nhận
			target_transfer_name: state.targetFullName, // Tên người người nhận
			transfer_amount: state.amount, // Số tiền chuyển
			transfer_detail: state.detail, // Nội dung chuyển
			fee_payer: state.feePayer, // Hình thức thanh toán phí. "0": Người chuyển trả, "1": Người nhận trả
		})
		.then((response) => {
			return response.data;
		})
		.catch(() => {
			return { status: false, message: 'An error occurred' };
		});
};

export const internalBankTransferSlice = createSlice({
	name: 'internalBankTransferSlice',
	initialState: {
		userNumberAccount: '',
		currentBalance: 0,
		targetNumberAccount: '',
		targetFullName: '',
		amount: 0,
		detail: '',
		feePayer: 0,
		isSubmit: false,
		isLoading: false,
		isStart: true,
		message: '',
	},
	extraReducers: {
		// Add reducers for additional action types here, and handle loading state as needed
		[doGetUserInfoThunk.fulfilled]: (state, action) => {
			// Add user to the state array
		},
		[doGetTargetNumberAccountThunk.fulfilled]: (state, action) => {
			// Add user to the state array
		},
	},
	reducers: {
		updateValue: (state, action) => {
			if (action.payload.option.includes('userNumberAccount')) {
				state.userNumberAccount = action.payload.value;
			}

			if (action.payload.option.includes('currentBalance')) {
				state.currentBalance = action.payload.value;
			}

			if (action.payload.option.includes('targetNumberAccount')) {
				state.targetNumberAccount = action.payload.value;
			}

			if (action.payload.option.includes('targetFullName')) {
				state.targetFullName = action.payload.value;
			}

			if (action.payload.option.includes('amount')) {
				state.amount = action.payload.value;
			}

			if (action.payload.option.includes('detail')) {
				state.detail = action.payload.value;
			}

			if (action.payload.option.includes('feePayer')) {
				state.feePayer = action.payload.value;
			}

			if (action.payload.option.includes('isLoading')) {
				state.isLoading = action.payload.value;
			}

			if (action.payload.option.includes('isSubmit')) {
				state.isSubmit = action.payload.value;
			}

			if (action.payload.option.includes('isStart')) {
				state.isStart = action.payload.value;
			}

			if (action.payload.option.includes('message')) {
				state.message = action.payload.value;
			}
		},
		resetValue: (state) => {
			state.userNumberAccount = '';
			state.currentBalance = 0;
			state.targetNumberAccount = '';
			state.targetFullName = '';
			state.amount = 0;
			state.detail = '';
			state.feePayer = 0;
			state.isSubmit = false;
			state.isLoading = false;
			state.isStart = true;
			state.message = '';
		},
	},
});
export const transferModel = (state) => state.internalBankTransferSlice;
export const { updateValue, resetValue } = internalBankTransferSlice.actions;
export default internalBankTransferSlice.reducer;
