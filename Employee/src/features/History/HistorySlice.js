import {createSlice} from '@reduxjs/toolkit';

export const historySlice = createSlice({
    name: 'historySlice',
    initialState: {
        isUserAccountChecked: true,
        dataUserAccount: [],
        dataNumberAccount: [],
        numberAccountFilter: {
            filter: "",
            type: "0"
        },
        userAccountFilter: {
            filter: "",
            type: "0"
        }

    },
    reducers: {
        updateSelected: (state, action) => {
            state.isUserAccountChecked = action.payload;
        },
        searchUserAccount: (state, action) => {
            if (action.payload.option.includes("type")) {

                state.userAccountFilter.type = action.payload.query;

            }

            if (action.payload.option.includes("filter")) {
                state.userAccountFilter.filter = action.payload.query;
            }

            state.dataUserAccount = [
                {account: "1", type: 1, amount: "1000", time: "20/06/2020"},
                {account: "2", type: 2, amount: "7000", time: "21/04/2020"},
                {account: "3", type: 0, amount: "5000", time: "25/01/2020"},
                {account: "1", type: 2, amount: "4000", time: "27/08/2020"},
                {account: "2", type: 2, amount: "2000", time: "23/05/2020"},
                {account: "3", type: 0, amount: "3000", time: "23/07/2020"},
                {account: "2", type: 1, amount: "1000", time: "20/06/2020"},
                {account: "2", type: 1, amount: "7000", time: "21/04/2020"},
                {account: "1", type: 0, amount: "5000", time: "25/01/2020"},
                {account: "2", type: 1, amount: "4000", time: "27/08/2020"},
                {account: "1", type: 2, amount: "2000", time: "23/05/2020"},
                {account: "3", type: 0, amount: "3000", time: "23/07/2020"}
            ];
            state.dataUserAccount = state.dataUserAccount.filter(item => item.account == state.userAccountFilter.filter && item.type == state.userAccountFilter.type);


        },

        searchNumberAccount: (state, action) => {
            if (action.payload.option.includes("type")) {
                state.numberAccountFilter.type = action.payload.query;
            }

            if (action.payload.option.includes("filter")) {
                state.numberAccountFilter.filter = action.payload.query;
            }

            state.dataNumberAccount = [
                {account: "1", type: 1, amount: "1000", time: "20/06/2020"},
                {account: "2", type: 2, amount: "7000", time: "21/04/2020"},
                {account: "3", type: 0, amount: "5000", time: "25/01/2020"},
                {account: "1", type: 2, amount: "4000", time: "27/08/2020"},
                {account: "2", type: 2, amount: "2000", time: "23/05/2020"},
                {account: "3", type: 0, amount: "3000", time: "23/07/2020"},
                {account: "2", type: 1, amount: "1000", time: "20/06/2020"},
                {account: "2", type: 1, amount: "7000", time: "21/04/2020"},
                {account: "1", type: 0, amount: "5000", time: "25/01/2020"},
                {account: "2", type: 1, amount: "4000", time: "27/08/2020"},
                {account: "1", type: 2, amount: "2000", time: "23/05/2020"},
                {account: "3", type: 0, amount: "3000", time: "23/07/2020"}
            ];
            state.dataNumberAccount = state.dataNumberAccount.filter(item => item.account == state.numberAccountFilter.filter && item.type == state.numberAccountFilter.type);

        },
    },
});
export const historyModel = state => state.historySlice;
export const {updateSelected, searchNumberAccount, searchUserAccount} = historySlice.actions;
export default historySlice.reducer;