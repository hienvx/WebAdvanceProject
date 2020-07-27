import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
const axios = require('axios').default;

export const doGetOTPInfoThunk = createAsyncThunk(
	'doGetOTPInfoThunk',
	async (data, thunkAPI) => {
		thunkAPI.dispatch(updateValue({ value: false, option: ['isStart'] }));
		thunkAPI.dispatch(updateValue({ value: true, option: ['isLoading'] }));
		thunkAPI.dispatch(updateValue({ value: '', option: ['message'] }));

		const optId = localStorage.getItem('otp_id');
		const response = await getOTPInfo(optId);
		console.log(response.data);
		if (response.status) {
			thunkAPI.dispatch(
				updateValue({
					value: response.data.customer_payment_id,
					option: ['userNumberAccount'],
				})
			);
			thunkAPI.dispatch(
				updateValue({
					value: response.data.target_transfer_id,
					option: ['targetNumberAccount'],
				})
			);
			thunkAPI.dispatch(
				updateValue({
					value: response.data.target_transfer_name,
					option: ['targetName'],
				})
			);
			thunkAPI.dispatch(
				updateValue({
					value: response.data.transfer_amount,
					option: ['amount'],
				})
			);
			thunkAPI.dispatch(
				updateValue({
					value: response.data.transfer_detail,
					option: ['detail'],
				})
			);
			thunkAPI.dispatch(
				updateValue({
					value: response.data.fee_payer,
					option: ['feePayer'],
				})
			);
			thunkAPI.dispatch(
				updateValue({
					value: response.data.status,
					option: ['status'],
				})
			);
			thunkAPI.dispatch(
				updateValue({
					value: moment
						.unix(response.data.time)
						.format('DD/MM/YYYY hh:mm:ss'),
					option: ['time'],
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

let getOTPInfo = function (state) {
	return axios
		.get('http://localhost:3000/transfer/get-otp-detail/' + state)
		.then((response) => {
			return response.data;
		})
		.catch(() => {
			return { status: false, message: 'An error occurred' };
		});
};

export const doConfirm = createAsyncThunk(
	'doConfirm',
	async (data, thunkAPI) => {
		thunkAPI.dispatch(updateValue({ value: true, option: ['isLoading'] }));
		thunkAPI.dispatch(updateValue({ value: '', option: ['message'] }));
		const response = await confirmOTP(
			thunkAPI.getState().verifyOTPSlice.otp
		);
		if (response.status) {
			// Go to message page
			window.location = "/tranferFinish";
		} else {
			thunkAPI.dispatch(
				updateValue({ value: response.message, option: ['message'] })
			);
		}

		thunkAPI.dispatch(updateValue({ value: false, option: ['isLoading'] }));
	}
);

let confirmOTP = async function (state) {
	return await axios
		.post('http://localhost:3000/transfer/confirm-tranfer', {
			otpId: localStorage.getItem('otp_id'), // id
			otp: state, // mã OTP
		})
		.then((response) => {
			return response.data;
		})
		.catch(() => {
			return { status: false, message: 'An error occurred' };
		});
};

export const verifyOTPSlice = createSlice({
	name: 'verifyOTPSlice',
	initialState: {
		userNumberAccount: '',
		targetNumberAccount: '',
		targetName: '',
		amount: 0,
		detail: '',
		otp: '',
		feePayer: 0,
		status: false,
		time: 0,
		isSubmit: false,
		isLoading: false,
		isStart: true,
		message: '',
	},
	extraReducers: {
		// Add reducers for additional action types here, and handle loading state as needed
		[doGetOTPInfoThunk.fulfilled]: (state, action) => {
			// Add user to the state array
		},
		[doConfirm.fulfilled]: (state, action) => {
			// Add user to the state array
		},
	},
	reducers: {
		updateValue: (state, action) => {
			if (action.payload.option.includes('userNumberAccount')) {
				state.userNumberAccount = action.payload.value;
			}
			if (action.payload.option.includes('targetNumberAccount')) {
				state.targetNumberAccount = action.payload.value;
			}
			if (action.payload.option.includes('targetName')) {
				state.targetName = action.payload.value;
			}
			if (action.payload.option.includes('amount')) {
				state.amount = action.payload.value;
			}
			if (action.payload.option.includes('detail')) {
				state.detail = action.payload.value;
			}
			if (action.payload.option.includes('otp')) {
				state.otp = action.payload.value;
			}
			if (action.payload.option.includes('feePayer')) {
				state.feePayer = action.payload.value;
			}
			if (action.payload.option.includes('status')) {
				state.status = action.payload.value;
			}
			if (action.payload.option.includes('time')) {
				state.time = action.payload.value;
			}
			if (action.payload.option.includes('isSubmit')) {
				state.isSubmit = action.payload.value;
			}
			if (action.payload.option.includes('isLoading')) {
				state.isLoading = action.payload.value;
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
			state.targetNumberAccount = '';
			state.amount = 0;
			state.detail = '';
			state.otp = '';
			state.feePayer = 0;
			state.status = false;
			state.time = 0;
			state.isSubmit = false;
			state.isLoading = false;
			state.isStart = true;
			state.message = '';
		},
	},
});
export const otpModel = (state) => state.verifyOTPSlice;
export const { updateValue, resetValue } = verifyOTPSlice.actions;
export default verifyOTPSlice.reducer;
