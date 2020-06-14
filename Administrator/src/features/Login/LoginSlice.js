import {createSlice} from '@reduxjs/toolkit';
const bcrypt = require('bcryptjs');
const saltRounds = 10;


const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: {
        userName: "",
        password: ""
    },
    reducers: {

        updateValue: (state, action) => {
            if (action.payload.option.includes("userName")) {
                state.userName = action.payload.value;
            }

            if (action.payload.option.includes("password")) {
                state.password = action.payload.value;
            }
        },
        doLogin: state => {
            const hash = bcrypt.hashSync(state.password, saltRounds);
            alert(hash);
        }
    },
});
export const loginModel = state => state.loginSlice;
export const {updateValue, doLogin} = loginSlice.actions;
export default loginSlice.reducer;