import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {CheckAuth, Logout} from "../Authentication";

export const doLogoutThunk = createAsyncThunk(
    'doLogoutThunk',
    async (data, thunkAPI) => {
        await Logout();
    }
);

export const doCheckLoginThunk = createAsyncThunk(
    'doCheckLoginThunk',
    async (data, thunkAPI) => {
        await CheckAuth();
    }
);

export const menuSlice = createSlice({
    name: 'menuSlice',
    initialState: {
        categorySelected: 0,
        isLogin: false
    },
    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [doCheckLoginThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        },

        [doLogoutThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        }
    },
    reducers: {
        selectCategory: (state, action) => {

            state.categorySelected = action.payload;
        },
    }
});
export const menuModel = state => state.menuSlice;
export const {selectCategory} = menuSlice.actions;
export default menuSlice.reducer;
