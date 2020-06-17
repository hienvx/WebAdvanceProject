import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const axios = require('axios').default;
let moment = require('moment');

let date = moment();
let dateEnd = date.format("yyyy-MM-DD");
let dateStart = date.clone().startOf('month').format("yyyy-MM-DD");

let getData = async function (state) {

    let data = await axios.post("http://localhost:3000/history",

        {
            condition: {
                bank: {'$regex': state.userAccountFilter.bankSelected},
                time: {
                    $gte: moment(state.userAccountFilter.dateStart).unix(),
                    $lte: moment(state.userAccountFilter.dateEnd).unix()
                }
            },
            sort: {time: -1},
            limit: state.userAccountFilter.limit,
            skip: state.userAccountFilter.skip
        }
    ).then(result => {
        return result.data;
    }).catch(() => {
        return [];
    });

    /*    data.sort(function (a, b) {
            if (a.bank < b.bank) {
                return -1;
            }
            if (a.bank > b.bank) {
                return 1;
            }
            return 0;
        });*/
    return data;
};

let getListBanks = async function () {
    return await axios.get("http://localhost:3000/banks").then(result => {
        return result.data;
    }).catch(() => {
        return [];
    });
};

export const doGetDataThunk = createAsyncThunk(
    'doGetDataThunk',
    async (data, thunkAPI) => {
        thunkAPI.dispatch(updateValue({value: true, option: ["isLoading"]}));
        thunkAPI.dispatch(updateValue({value: false, option: ["isStart"]}));
        let banks = await getListBanks();
        let dataUserAccount = await getData(thunkAPI.getState().historySlice);
        let total = 0.0;

        dataUserAccount.results.map((value, index) => {
            total += parseFloat(value.amount);
        });

        thunkAPI.dispatch(updateValue({value: dataUserAccount.results, option: ["dataUserAccount"]}));
        thunkAPI.dispatch(updateValue({value: dataUserAccount.total, option: ["totalData"]}));
        thunkAPI.dispatch(updateValue({value: banks, option: ["banks"]}));
        thunkAPI.dispatch(updateValue({value: total, option: ["total"]}));

        thunkAPI.dispatch(updateValue({value: false, option: ["isLoading"]}));
    }
);

const historySlice = createSlice({
    name: 'historySlice',
    initialState: {
        banks: [],
        total: 0,

        dataUserAccount: [],
        totalData: 0,
        currentPage: 1,
        totalPage: 0,
        userAccountFilter: {
            bankSelected: "",
            dateStart: dateStart,
            dateEnd: dateEnd,
            skip: 0,
            limit: 10
        },
        isStart: true,
        isLoading: false,

    },
    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [doGetDataThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        },
    },
    reducers: {
        updateValue: (state, action) => {
            if (action.payload.option.includes("banks")) {
                state.banks = action.payload.value;
            }

            if (action.payload.option.includes("isStart")) {
                state.isStart = action.payload.value;
            }

            if (action.payload.option.includes("dataUserAccount")) {
                state.dataUserAccount = action.payload.value;
            }

            if (action.payload.option.includes("total")) {
                state.total = action.payload.value;
            }

            if (action.payload.option.includes("isLoading")) {
                state.isLoading = action.payload.value;
            }

            if (action.payload.option.includes("bankSelected")) {
                state.userAccountFilter.bankSelected = action.payload.query;
            }

            if (action.payload.option.includes("dateStart")) {
                state.userAccountFilter.dateStart = action.payload.query;
            }

            if (action.payload.option.includes("dateEnd")) {
                state.userAccountFilter.dateEnd = action.payload.query;
            }

            if (action.payload.option.includes("skip")) {
                state.userAccountFilter.skip = action.payload.query;
                state.currentPage = Math.ceil(state.userAccountFilter.skip / state.userAccountFilter.limit);
            }

            if (action.payload.option.includes("totalData")) {
                state.totalData = action.payload.value;
                state.totalPage = Math.ceil(state.totalData / state.userAccountFilter.limit);
            }

            if (action.payload.option.includes("currentPage")) {
                if (action.payload.value > 0 && action.payload.value <= state.totalPage) {
                    state.currentPage = action.payload.value;
                    state.userAccountFilter.skip = state.userAccountFilter.limit * (state.currentPage - 1);
                }

            }
        }

    },
});
export const historyModel = state => state.historySlice;
export const {updateValue} = historySlice.actions;
export default historySlice.reducer;