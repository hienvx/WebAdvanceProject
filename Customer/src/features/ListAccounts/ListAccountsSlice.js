import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const axios = require("axios").default;

export const doGetListAccountsThunk = createAsyncThunk(
  "doGetListAccountsThunk",
  async (data, thunkAPI) => {
    thunkAPI.dispatch(updateValue({ value: false, option: ["isStart"] }));
    thunkAPI.dispatch(updateValue({ value: true, option: ["isLoading"] }));

    let dataUserSavingAccounts = await getListAccounts(
      thunkAPI.getState().listAccountsSlice.userAccountFilter
    );

    let dataUserDetail = await getUserDetail();
    // console.log("dataUserSavingAccounts", dataUserSavingAccounts);
    thunkAPI.dispatch(
      updateValue({
        value: dataUserDetail,
        option: ["dataUserDetail"],
      })
    );
    thunkAPI.dispatch(
      updateValue({
        value: dataUserSavingAccounts,
        option: ["dataUserSavingAccounts"],
      })
    );
    thunkAPI.dispatch(
      updateValue({
        value: dataUserSavingAccounts.length,
        option: ["totalData"],
      })
    );
    thunkAPI.dispatch(updateValue({ value: false, option: ["isLoading"] }));
  }
);

let getListAccounts = function (state) {
  return axios
    .get("http://localhost:3000/customers/getSavingAccounts", {
      headers: {
        "x-access-token": localStorage.getItem("accessToken_Employee_KAT"),
      },
    })
    .then((result) => {
      return result.data;
    })
    .catch((e) => {
      console.log(e);
      return [];
    });
};

let getUserDetail = function (state) {
  return axios
    .get("http://localhost:3000/customers/getUserDetail", {
      headers: {
        "x-access-token": localStorage.getItem("accessToken_Employee_KAT"),
      },
    })
    .then((result) => {
      return result.data;
    })
    .catch((e) => {
      console.log(e);
      return {};
    });
};

export const listAccountsSlice = createSlice({
  name: "listAccountsSlice",
  initialState: {
    dataUserDetail: {
      paymentAccount: {
        numberAccount: "",
        currentBalance: "",
      },
    },
    dataUserSavingAccounts: [],
    userAccountFilter: {
      filter: "",
      type: "0",
      limit: 10,
      skip: 0,
    },
    totalData: 0,
    currentPage: 1,
    totalPage: 0,
    isStart: true,
    isLoading: false,
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [doGetListAccountsThunk.fulfilled]: (state, action) => {
      // Add user to the state array
      /*state.entities.push(action.payload)*/
    },
  },
  reducers: {
    updateValue: (state, action) => {
      if (action.payload.option.includes("type")) {
        state.userAccountFilter.type = action.payload.value;
      }

      if (action.payload.option.includes("filter")) {
        state.userAccountFilter.filter = action.payload.value;
      }

      if (action.payload.option.includes("isStart")) {
        state.isStart = action.payload.value;
      }

      if (action.payload.option.includes("isLoading")) {
        state.isLoading = action.payload.value;
      }

      if (action.payload.option.includes("dataUserSavingAccounts")) {
        state.dataUserSavingAccounts = action.payload.value;
      }

      if (action.payload.option.includes("dataUserDetail")) {
        state.dataUserDetail = action.payload.value;
      }

      if (action.payload.option.includes("skip")) {
        state.userAccountFilter.skip = action.payload.query;
        state.currentPage = Math.ceil(
          state.userAccountFilter.skip / state.userAccountFilter.limit
        );
      }

      if (action.payload.option.includes("totalData")) {
        state.totalData = action.payload.value;
        state.totalPage = Math.ceil(
          state.totalData / state.userAccountFilter.limit
        );
      }

      if (action.payload.option.includes("currentPage")) {
        if (
          action.payload.value > 0 &&
          action.payload.value <= state.totalPage
        ) {
          state.currentPage = action.payload.value;
          state.userAccountFilter.skip =
            state.userAccountFilter.limit * (state.currentPage - 1);
        }
      }
    },
  },
});
export const listAccountsModel = (state) => state.listAccountsSlice;
export const { updateValue } = listAccountsSlice.actions;
export default listAccountsSlice.reducer;
