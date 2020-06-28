import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
const axios = require('axios').default;

export const doGetHistoryTransactionThunk = createAsyncThunk(
    'doGetHistoryTransactionThunk',
    async (data, thunkAPI) => {
        thunkAPI.dispatch(updateValue({value: false, option: ["isStart"]}));
        thunkAPI.dispatch(updateValue({value: true, option: ["isLoading"]}));

        let dataUserAccount = await getHistoryTransaction(thunkAPI.getState().historySlice.userAccountFilter);

        thunkAPI.dispatch(updateValue({value: dataUserAccount.results, option: ["dataUserAccount"]}));
        thunkAPI.dispatch(updateValue({value: dataUserAccount.total, option: ["totalData"]}));
        thunkAPI.dispatch(updateValue({value: false, option: ["isLoading"]}));

    }
);

let getHistoryTransaction = function (state) {
    return axios.post("http://localhost:3000/history",
        {
            condition: {
                account: {'$regex': state.filter},
                type: parseInt(state.type),
            },
            sort: {time: -1},
            limit: state.limit,
            skip: state.skip
        }).then(result => {
        return result.data;
    }).catch(() => {
        return [];
    });
};

export const historySlice = createSlice({
    name: 'historySlice',
    initialState: {
        dataUserAccount: [],
        userAccountFilter: {
            filter: "",
            type: "0",
            limit: 10,
            skip: 0
        },
        totalData: 0,
        currentPage: 1,
        totalPage: 0,
        isStart: true,
        isLoading: false,

    },
    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [doGetHistoryTransactionThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        }
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

            if (action.payload.option.includes("dataUserAccount")) {
                state.dataUserAccount = action.payload.value;
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
        },
    },
});
export const historyModel = state => state.historySlice;
export const {updateValue} = historySlice.actions;
export default historySlice.reducer;