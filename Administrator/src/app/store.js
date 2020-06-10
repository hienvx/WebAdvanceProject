import { configureStore } from '@reduxjs/toolkit';
import menuSlice from "../features/Menu/MenuSlice";
import historySlice from "../features/History/HistorySlice";

export default configureStore({
  reducer: {
    menuSlice: menuSlice,
    historySlice:historySlice
  },
});
