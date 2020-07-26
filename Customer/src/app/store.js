import { configureStore } from "@reduxjs/toolkit";
import menuSlice from "../features/Menu/MenuSlice";
import customerAccount from "../features/FormCreateCustomerAccount/CustomerAccountSlice";
import historySlice from "../features/History/HistorySlice";
import rechargeSlice from "../features/Recharge/RechargeSlice";
import loginSlice from "../features/Login/LoginSlice";
import internalBankTransferSlice from "../features/InternalBankTransfer/InternalBankTransferSlice";

export default configureStore({
  reducer: {
    menuSlice: menuSlice,
    customerAccount: customerAccount,
    historySlice: historySlice,
    rechargeSlice: rechargeSlice,
	loginSlice: loginSlice,
	internalBankTransferSlice: internalBankTransferSlice,
  },
});
