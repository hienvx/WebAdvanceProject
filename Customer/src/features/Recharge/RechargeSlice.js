import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const axios = require("axios").default;

export const doGetUserAccountThunk = createAsyncThunk(
  "doGetUserAccountThunk",
  async (data, thunkAPI) => {
    thunkAPI.dispatch(updateValue({ value: true, option: ["isLoading"] }));
    thunkAPI.dispatch(updateValue({ value: "", option: ["message"] }));
    const response = await getUserAccount(thunkAPI.getState().rechargeSlice);
    if (response.status) {
      thunkAPI.dispatch(
        updateValue({
          value: response.data.profile.fullName,
          option: ["message"],
        })
      );
    } else {
      thunkAPI.dispatch(
        updateValue({ value: response.message, option: ["message"] })
      );
    }

    thunkAPI.dispatch(updateValue({ value: false, option: ["isLoading"] }));
  }
);

export const doGetNumberAccountThunk = createAsyncThunk(
  "doGetNumberAccountThunk",
  async (data, thunkAPI) => {
    thunkAPI.dispatch(updateValue({ value: true, option: ["isLoading"] }));
    thunkAPI.dispatch(updateValue({ value: "", option: ["message"] }));
    const response = await getNumberAccount(thunkAPI.getState().rechargeSlice);
    if (response.status) {
      thunkAPI.dispatch(
        updateValue({
          value: response.data.profile.fullName,
          option: ["message"],
        })
      );
    } else {
      thunkAPI.dispatch(
        updateValue({ value: response.message, option: ["message"] })
      );
    }
    thunkAPI.dispatch(updateValue({ value: false, option: ["isLoading"] }));
  }
);

let getUserAccount = async function (state) {
  return await axios
    .get("http://localhost:3000/accounts/UserAccount/" + state.userAccount)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return { status: false, message: "An error occurred" };
    });
};

let getNumberAccount = async function (state) {
  return await axios
    .get("http://localhost:3000/accounts/NumberAccount/" + state.numberAccount)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return { status: false, message: "An error occurred" };
    });
};

export const doPaymentUserAccountThunk = createAsyncThunk(
  "doPaymentUserAccountThunk",
  async (data, thunkAPI) => {
    let state = thunkAPI.getState().rechargeSlice;
    if (state.userAccount === "") {
      thunkAPI.dispatch(
        updateValue({
          value: "User account must be not empty",
          option: ["message"],
        })
      );
      return;
    }
    thunkAPI.dispatch(updateValue({ value: true, option: ["isLoading"] }));
    thunkAPI.dispatch(updateValue({ value: "", option: ["message"] }));
    const response = await paymentUserAccount(thunkAPI.getState());
    thunkAPI.dispatch(
      updateValue({ value: response.message, option: ["message"] })
    );
    thunkAPI.dispatch(updateValue({ value: false, option: ["isLoading"] }));
    thunkAPI.dispatch(updateValue({ value: true, option: ["isSubmit"] }));
  }
);

export const doPaymentNumberAccountThunk = createAsyncThunk(
  "doPaymentNumberAccountThunk",
  async (data, thunkAPI) => {
    let state = thunkAPI.getState().rechargeSlice;
    if (state.numberAccount === "") {
      thunkAPI.dispatch(
        updateValue({
          value: "Number account must be not empty",
          option: ["message"],
        })
      );
      return;
    }

    thunkAPI.dispatch(updateValue({ value: true, option: ["isLoading"] }));
    thunkAPI.dispatch(updateValue({ value: "", option: ["message"] }));
    const response = await paymentNumberAccount(thunkAPI.getState());
    thunkAPI.dispatch(
      updateValue({ value: response.message, option: ["message"] })
    );
    thunkAPI.dispatch(updateValue({ value: false, option: ["isLoading"] }));
    thunkAPI.dispatch(updateValue({ value: true, option: ["isSubmit"] }));
  }
);

let paymentUserAccount = async function (state) {
  return await axios
    .post("http://localhost:3000/accounts/payment/Account", {
      data: {
        account: state.rechargeSlice.userAccount, // số tài khoản cần nạp
        amount: state.rechargeSlice.amount, //số tiền nạp
        employeeAccount: state.loginSlice.userName, // tài khoản nhân viên nạp
        //"bank": "" // ngân hàng nạp
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return { status: false, message: "An error occurred" };
    });
};
let paymentNumberAccount = async function (state) {
  return await axios
    .post("http://localhost:3000/accounts/payment/NumberAccount", {
      data: {
        numberAccount: state.rechargeSlice.numberAccount, // số tài khoản cần nạp
        amount: state.rechargeSlice.amount, //số tiền nạp
        employeeAccount: state.loginSlice.userName, // tài khoản nhân viên nạp
        //"bank": "" // ngân hàng nạp
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return { status: false, message: "An error occurred" };
    });
};

export const rechargeSlice = createSlice({
  name: "rechargeSlice",
  initialState: {
    userAccount: "",
    numberAccount: "",
    amount: 0,
    isUserAccountChecked: true,
    isSubmit: false,
    isLoading: false,
    message: "",
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [doPaymentUserAccountThunk.fulfilled]: (state, action) => {
      // Add user to the state array
      /*state.entities.push(action.payload)*/
    },
    [doPaymentNumberAccountThunk.fulfilled]: (state, action) => {
      // Add user to the state array
      /*state.entities.push(action.payload)*/
    },
    [doGetNumberAccountThunk.fulfilled]: (state, action) => {
      // Add user to the state array
      /*state.entities.push(action.payload)*/
    },
    [doGetUserAccountThunk.fulfilled]: (state, action) => {
      // Add user to the state array
      /*state.entities.push(action.payload)*/
    },
  },
  reducers: {
    updateValue: (state, action) => {
      if (action.payload.option.includes("isSubmit")) {
        state.isSubmit = action.payload.value;
      }

      if (action.payload.option.includes("isUserAccountChecked")) {
        state.isUserAccountChecked = action.payload.value;
      }

      if (action.payload.option.includes("amount")) {
        state.amount = action.payload.value;
      }

      if (action.payload.option.includes("userAccount")) {
        state.userAccount = action.payload.value;
      }

      if (action.payload.option.includes("numberAccount")) {
        state.numberAccount = action.payload.value;
      }

      if (action.payload.option.includes("isLoading")) {
        state.isLoading = action.payload.value;
      }

      if (action.payload.option.includes("message")) {
        state.message = action.payload.value;
      }
    },
    resetValue: (state) => {
      state.userAccount = "";
      state.numberAccount = "";
      state.amount = "0";
      state.isUserAccountChecked = true;
      state.iSubmit = false;
    },
  },
});
export const rechargeModel = (state) => state.rechargeSlice;
export const { updateValue, resetValue } = rechargeSlice.actions;
export default rechargeSlice.reducer;
