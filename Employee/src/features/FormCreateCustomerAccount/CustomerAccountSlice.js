import {createSlice} from '@reduxjs/toolkit';

/*const bcrypt = require('bcrypt');
const saltRounds = 10;*/

let password = Math.random().toString(36).slice(-8);

export const customerAccount = createSlice({
    name: 'customerAccount',
    initialState: {
        userName: "",
        password: password,
        passwordHash: "",//bcrypt.hashSync(password, saltRounds),
        fullName: "",
        email: "",
        phone: "",
        isSubmit: false,
    },
    reducers: {
        submit: (state, action) => {
            state.isSubmit = action.payload;
        },
        updateUserName: (state, action) => {

            state.userName = action.payload;
        },

        updateFullName: (state, action) => {
            state.fullName = action.payload;
        },
        updateEmail: (state, action) => {
            state.email = action.payload;
        },
        updatePhone: (state, action) => {
            state.phone = action.payload;
        },
    },
});
export const customerModel = state => state.customerAccount;
export const {submit, updateUserName, updateFullName, updateEmail, updatePhone} = customerAccount.actions;
export default customerAccount.reducer;