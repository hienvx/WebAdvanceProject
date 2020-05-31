import {createSlice} from '@reduxjs/toolkit';

export const rechargeSlice = createSlice({
    name: 'rechargeSlice',
    initialState: {
        userAccount: "",
        numberAccount: "",
        amount:"0",
        isUserAccountChecked: true,
        iSubmit:false,
    },
    reducers: {

        updateUserAccount: (state, action) => {

            state.userAccount = action.payload;
        },

        updateNumberAccount: (state, action) => {
            state.numberAccount = action.payload;
        },
        updateAmount: (state, action) => {
            state.amount = action.payload;
        },

        updateSelected:(state, action) =>{
            state.isUserAccountChecked = action.payload;
        },
        submit: state=>{
            state.isSubmit = true;
        }
    },
});
export const rechargeModel = state => state.rechargeSlice;
export const {updateUserAccount, updateNumberAccount, updateAmount, updateSelected, submit} = rechargeSlice.actions;
export default rechargeSlice.reducer;