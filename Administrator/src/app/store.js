import { configureStore } from '@reduxjs/toolkit';
import menuSlice from "../features/Menu/MenuSlice";

export default configureStore({
  reducer: {
    menuSlice: menuSlice,
  },
});
