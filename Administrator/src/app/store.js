import {configureStore} from '@reduxjs/toolkit';
import menuSlice from "../features/Menu/MenuSlice";
import historySlice from "../features/History/HistorySlice";
import loginSlice from "../features/Login/LoginSlice"
import manageSlice from "../features/ManageEmployee/ManageSlice";
import employeeSlice from "../features/ManageEmployee/FormEmployee/EmployeeSlice";

export default configureStore({
    reducer: {
        menuSlice: menuSlice,
        historySlice: historySlice,
        loginSlice: loginSlice,
        manageSlice:manageSlice,
        employeeSlice:employeeSlice
    },
});
