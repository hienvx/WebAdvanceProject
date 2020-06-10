import {configureStore} from '@reduxjs/toolkit';
import menuSlice from "../features/Menu/MenuSlice";
import historySlice from "../features/History/HistorySlice";
import loginSlice from "../features/Login/LoginSlice"

export default configureStore({
    reducer: {
        menuSlice: menuSlice,
        historySlice: historySlice,
        loginSlice: loginSlice
    },
});
