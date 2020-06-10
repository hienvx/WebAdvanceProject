import {createSlice} from '@reduxjs/toolkit';

let moment = require('moment');

let date = moment();
let dateEnd = date.format("yyyy-MM-DD");
let dateStart = date.clone().startOf('month').format("yyyy-MM-DD");

let getData = function (state) {
    state.dataUserAccount = [
        {account: "1", type: 1, amount: "1000", time: "02/06/2020", bank: "ACB"},
        {account: "2", type: 2, amount: "7000", time: "21/06/2020", bank: "Sacombank"},
        {account: "3", type: 0, amount: "5000", time: "25/06/2020", bank: "ACB"},
        {account: "1", type: 2, amount: "4000", time: "27/06/2020", bank: "Viettin"},
        {account: "2", type: 2, amount: "2000", time: "23/06/2020", bank: "ACB"},
        {account: "3", type: 0, amount: "3000", time: "23/06/2020", bank: "Viettin"},
        {account: "2", type: 1, amount: "1000", time: "20/06/2020", bank: "Viettin"},
        {account: "2", type: 1, amount: "7000", time: "21/06/2020", bank: "ACB"},
        {account: "1", type: 0, amount: "5000", time: "25/06/2020", bank: "Sacombank"},
        {account: "2", type: 1, amount: "4000", time: "27/06/2020", bank: "Viettin"},
        {account: "1", type: 2, amount: "2000", time: "23/06/2020", bank: "ACB"},
        {account: "3", type: 0, amount: "3000", time: "23/06/2020", bank: "Sacombank"}
    ];
    state.dataUserAccount = state.dataUserAccount.filter(item =>
            (item.bank == state.userAccountFilter.bankSelected || state.userAccountFilter.bankSelected == 'all')
        /*&&
        item.time >= state.userAccountFilter.dateStart &&
        item.time <= state.userAccountFilter.dateEnd*/
    );
    state.dataUserAccount.sort(function(a, b){
        if(a.bank < b.bank) { return -1; }
        if(a.bank > b.bank) { return 1; }
        return 0;
    });
};

const historySlice = createSlice({
    name: 'historySlice',
    initialState: {
        banks: [
            "ACB",
            "Sacombank",
            "Viettin",
            "BIDV"
        ],
        total: 0,

        dataUserAccount: [],
        userAccountFilter: {
            bankSelected: "all",
            dateStart: dateStart,
            dateEnd: dateEnd,
        }

    },
    reducers: {

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

            getData(state);

            state.total = 0.0;
            state.dataUserAccount.map((value, index) => {
                state.total += parseFloat(value.amount);
            });
        },

    },
});
export const historyModel = state => state.historySlice;
export const {searchUserAccount} = historySlice.actions;
export default historySlice.reducer;