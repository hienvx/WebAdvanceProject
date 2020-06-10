import {createSlice} from '@reduxjs/toolkit';

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

        }
    },
});
export const loginModel = state => state.loginSlice;
export const {updateValue, doLogin} = loginSlice.actions;
export default loginSlice.reducer;