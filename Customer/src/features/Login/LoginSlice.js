import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignIn } from "../Authentication";

export const doLoginThunk = createAsyncThunk(
  "doLoginThunk",
  async (data, thunkAPI) => {
    thunkAPI.dispatch(updateValue({ value: true, option: ["isLoading"] }));
    thunkAPI.dispatch(updateValue({ value: "", option: ["message"] }));
    const response = await SignIn(thunkAPI.getState().loginSlice);
    thunkAPI.dispatch(updateValue({ value: response, option: ["message"] }));
    thunkAPI.dispatch(updateValue({ value: false, option: ["isLoading"] }));
    return response;
  }
);

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: {
    userName: "truongtin113",
    password: "123456",
    recaptchaToken: "",
    message: "",
    isLoading: false,
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [doLoginThunk.fulfilled]: (state, action) => {
      // Add user to the state array
      /*state.entities.push(action.payload)*/
    },
  },
  reducers: {
    updateValue: (state, action) => {
      if (action.payload.option.includes("userName")) {
        state.userName = action.payload.value;
      }

      if (action.payload.option.includes("password")) {
        state.password = action.payload.value;
      }

      if (action.payload.option.includes("recaptchaToken")) {
        state.recaptchaToken = action.payload.value;
      }

      if (action.payload.option.includes("message")) {
        state.message = action.payload.value;
      }

      if (action.payload.option.includes("isLoading")) {
        state.isLoading = action.payload.value;
      }
    },
  },
});

export const loginModel = (state) => state.loginSlice;
export const { updateValue } = loginSlice.actions;
export default loginSlice.reducer;
