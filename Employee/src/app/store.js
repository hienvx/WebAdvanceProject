import { configureStore } from '@reduxjs/toolkit';
import menuSlice from "../features/Menu/MenuSlice";
import customerAccount from "../features/FormCreateCustomerAccount/CustomerAccountSlice";
import historySlice from "../features/History/HistorySlice";
import rechargeSlice from "../features/Recharge/RechargeSlice";

export default configureStore({
    reducer: {
        menuSlice:menuSlice,
        customerAccount:customerAccount,
        historySlice:historySlice,
        rechargeSlice:rechargeSlice
    },
});
