import React from "react";
import $ from "jquery";
import { CreateCustomerAccount } from "../FormCreateCustomerAccount/CustomerAccount";
// import { History } from "../History/History";
import { Recharge } from "../Recharge/Recharge";
import { InternalBankTransfer } from "../InternalBankTransfer/InternalBankTransfer";
import { VerifyOTP } from "../VerifyOTP/VerifyOTP";
import { InternalTransferFinish } from "../InternalBankTransfer/InternalTransferFinish"
import { useDispatch, useSelector } from "react-redux";
import {
  menuModel,
//   selectCategory,
  doLogoutThunk,
  doCheckLoginThunk,
} from "./MenuSlice";
import { Route, NavLink } from "react-router-dom";

export function Menu() {
  const dispatch = useDispatch();
  const menu = useSelector(menuModel);
  if (menu.isLogin === false) {
    dispatch(doCheckLoginThunk());
  }

  return (
    <div className="wrapper d-flex align-items-stretch">
      <nav id="sidebar">
        <div className="p-4 pt-5">
          <ul className="list-unstyled components mb-5">

			<li>
				<NavLink activeClassName="active" exact to="/createCustomerAccount">
				Danh sách tài khoản
				</NavLink>
            </li>

			<li>
				<NavLink activeClassName="active" to="/recharge">
				Thiết lập danh sách người nhận
				</NavLink>
            </li>

			<li>
				<NavLink activeClassName="active" to="/internalTransfer">Chuyển khoản nội bộ</NavLink>
            </li>
            <li hidden><NavLink to="/verifyOTP"></NavLink></li>
            <li hidden><NavLink to="/tranferFinish"></NavLink></li>

            {/* <li>
              <NavLink activeClassName="active" to="/interTransfer">
                Chuyển khoản liên ngân hàng
              </NavLink>
            </li> */}
          </ul>

          <div className="footer">
          </div>
        </div>
      </nav>

      <div id="content" className="p-4 p-md-5">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <button
              type="button"
              id="sidebarCollapse"
              className="btn btn-primary"
              onClick={() => {
                $("#sidebar").toggleClass("active");
              }}
            >
              <i className="fa fa-bars"></i>
            </button>

            <h3>Internet banking</h3>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                dispatch(doLogoutThunk());
              }}
            >
              Đăng xuất
            </button>
          </div>
        </nav>

        {/* <CreateCustomerAccount hidden={menu.categorySelected !== 0} />
        <Recharge hidden={menu.categorySelected !== 1} />
        <InternalBankTransfer hidden={menu.categorySelected !== 2} />
        <InterBankTransfer hidden={menu.categorySelected !== 3} /> */}
		<Route exact path="/createCustomerAccount" component={CreateCustomerAccount} />
		<Route path="/recharge" component={Recharge} />
		<Route path="/internalTransfer" component={InternalBankTransfer} />
		<Route path="/verifyOTP" component={VerifyOTP} />
		<Route path="/tranferFinish" component={InternalTransferFinish} />
      </div>
    </div>
  );
}
