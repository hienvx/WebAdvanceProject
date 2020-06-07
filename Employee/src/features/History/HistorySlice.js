import {createSlice} from '@reduxjs/toolkit';

export const historySlice = createSlice({
    name: 'historySlice',
    initialState: {
        isUserAccountChecked: true,
        dataUserAccount: [],
        dataNumberAccount: [],
        filter: {

            numberAccountFilter: "",
            userAccountFilter: "",
            type: "0"
        }

    },
    reducers: {
        updateSelected: (state, action) => {
            state.isUserAccountChecked = action.payload;
        },

        updateFilterAndSearch: (state, action) =>{

            if(action.payload.option.includes("type")){
                state.filter.type = action.payload.query;
            }

            if(action.payload.option.includes("numberAccountFilter")){
                state.filter.numberAccountFilter = action.payload.query;


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
                state.dataNumberAccount = state.dataNumberAccount.filter(item => item.account == state.filter.numberAccountFilter && item.type == state.filter.type);


            }

            if(action.payload.option.includes("userAccountFilter")){
                state.filter.userAccountFilter = action.payload.query;


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
                state.dataUserAccount = state.dataUserAccount.filter(item => item.account == state.filter.userAccountFilter && item.type == state.filter.type);

            }

        },
    },
});
export const historyModel = state => state.historySlice;
export const {updateSelected, updateFilterAndSearch } = historySlice.actions;
export default historySlice.reducer;