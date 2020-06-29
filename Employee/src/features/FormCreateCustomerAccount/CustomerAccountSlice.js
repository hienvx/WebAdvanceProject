import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {SignUp} from "../Authentication";


export const doSignUpThunk = createAsyncThunk(
    'doSignUpThunk',
    async (data, thunkAPI) => {
        thunkAPI.dispatch(updateValue({value: true, option: ["isLoading"]}));
        thunkAPI.dispatch(updateValue({value: "", option: ["message"]}));
        const response = await SignUp(thunkAPI.getState().customerAccount);
        thunkAPI.dispatch(updateValue({value: response.message, option: ["message"]}));
        thunkAPI.dispatch(updateValue({value: true, option: ["isSubmit"]}));
        thunkAPI.dispatch(updateValue({value: false, option: ["isLoading"]}));
        return response;
    }
);

let password = Math.random().toString(36).slice(-8);
export const customerAccount = createSlice({
    name: 'customerAccount',
    initialState: {
        userName: "nhutthanh",
        password: password,
        fullName: "Phạm Nhựt Thanh",
        email: "thanh@gmail.com",
        phone: "0944956891",
        paymentAccount: {
            currentBalance: 0
        },
        savingAccount: {},
        isSubmit: false,
        isLoading: false,
        message: ""
    },
    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [doSignUpThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        }
    },
    reducers: {
        resetValue: state => {
            state.userName = "";
            state.password = password;
            state.passwordHash = "";//bcrypt.hashSync(password, saltRounds),
            state.fullName = "";
            state.email = "";
            state.phone = "";
            state.isSubmit = false;
            state.currentBalance = 0;
        },
        updateValue: (state, action) => {
            if (action.payload.option.includes("userName")) {
                state.userName = action.payload.value;
            }

            if (action.payload.option.includes("fullName")) {
                state.fullName = action.payload.value;
            }

            if (action.payload.option.includes("email")) {
                state.email = action.payload.value;
            }

            if (action.payload.option.includes("phone")) {
                state.phone = action.payload.value;
            }

            if (action.payload.option.includes("isLoading")) {
                state.isLoading = action.payload.value;
            }

            if (action.payload.option.includes("message")) {
                state.message = action.payload.value;
            }
            if (action.payload.option.includes("isSubmit")) {
                state.isSubmit = action.payload.value;
            }

            if (action.payload.option.includes("currentBalance")) {
                state.paymentAccount.currentBalance = action.payload.value;
            }
        },
    },
});
export const customerModel = state => state.customerAccount;
export const {updateValue, resetValue} = customerAccount.actions;
export default customerAccount.reducer;