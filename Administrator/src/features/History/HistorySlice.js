import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const axios = require('axios').default;
let moment = require('moment');

let date = moment();
let dateEnd = date.format("yyyy-MM-DD");
let dateStart = date.clone().startOf('month').format("yyyy-MM-DD");

let getData = async function () {

    let data = await axios.post("http://localhost:3000/history",

        {
            condition: {account: "nhutthanh340"},
            sort: {time: -1}
        }
    ).then(result => {
        return result.data;
    }).catch(() => {
        return [];
    });

    /*state.dataUserAccount = state.dataUserAccount.filter(item =>
            (item.bank == state.userAccountFilter.bankSelected || state.userAccountFilter.bankSelected == 'all')
        /!*&&
        item.time >= state.userAccountFilter.dateStart &&
        item.time <= state.userAccountFilter.dateEnd*!/
    );*/

    data.sort(function (a, b) {
        if (a.bank < b.bank) {
            return -1;
        }
        if (a.bank > b.bank) {
            return 1;
        }
        return 0;
    });
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
        thunkAPI.dispatch(updateValue({value: false, option: ["isStart"]}));
        /*        let banks = await getListBanks();
                thunkAPI.dispatch(updateValue({value: banks, option: ["banks"]}));*/

        let dataUserAccount = await getData();
        thunkAPI.dispatch(updateValue({value: dataUserAccount, option: ["dataUserAccount"]}));
    }
);

const historySlice = createSlice({
    name: 'historySlice',
    initialState: {
        banks: [],
        total: 0,

        dataUserAccount: [],
        userAccountFilter: {
            bankSelected: "all",
            dateStart: dateStart,
            dateEnd: dateEnd,
        },
        isStart: true
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

        },
        searchUserAccount: (state, action) => {
            if (action.payload.option.includes("bankSelected")) {
                state.userAccountFilter.bankSelected = action.payload.query;
            }

            if (action.payload.option.includes("dateStart")) {
                state.userAccountFilter.dateStart = action.payload.query;
            }

            if (action.payload.option.includes("dateEnd")) {
                state.userAccountFilter.dateEnd = action.payload.query;
            }

            doGetDataThunk();

            state.total = 0.0;
            state.dataUserAccount.map((value, index) => {
                state.total += parseFloat(value.amount);
            });
        },

    },
});
export const historyModel = state => state.historySlice;
export const {searchUserAccount, updateValue} = historySlice.actions;
export default historySlice.reducer;