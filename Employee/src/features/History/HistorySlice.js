import {createSlice} from '@reduxjs/toolkit';

export const historySlice = createSlice({
    name: 'historySlice',
    initialState: {
        isUserAccountChecked: true,
    },
    reducers: {
        updateSelected:(state, action) =>{
            state.isUserAccountChecked = action.payload;
        }
    },
});
export const historyModel = state => state.historySlice;
export const {updateSelected} = historySlice.actions;
export default historySlice.reducer;