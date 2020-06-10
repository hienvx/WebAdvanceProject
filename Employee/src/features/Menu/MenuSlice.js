import {createSlice} from '@reduxjs/toolkit';

export const menuSlice = createSlice({
    name: 'menuSlice',
    initialState: {
        categorySelected: 0,
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
