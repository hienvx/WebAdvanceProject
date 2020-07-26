import React from "react";
import $ from "jquery";
import { CreateCustomerAccount } from "../FormCreateCustomerAccount/CustomerAccount";
import { History } from "../History/History";
import { Recharge } from "../Recharge/Recharge";
import { useDispatch, useSelector } from "react-redux";
import {
  menuModel,
  selectCategory,
  doLogoutThunk,
  doCheckLoginThunk,
} from "./MenuSlice";

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
            <li className={menu.categorySelected === 0 ? "active" : null}>
              <a
                onClick={() => {
                  dispatch(selectCategory(0));
                }}
              >
                Danh sách tài khoản
              </a>
            </li>

            <li className={menu.categorySelected === 1 ? "active" : null}>
              <a
                onClick={() => {
                  dispatch(selectCategory(1));
                }}
              >
                Thiết lập danh sách người nhận
              </a>
            </li>

            <li className={menu.categorySelected === 2 ? "active" : null}>
              <a
                onClick={() => {
                  dispatch(selectCategory(2));
                }}
              >
                Chuyển khoản
              </a>
            </li>

            <li className={menu.categorySelected === 3 ? "active" : null}>
              <a
                onClick={() => {
                  dispatch(selectCategory(3));
                }}
              >
                Quản lý nhắc nợ
              </a>
            </li>
          </ul>

          <div className="footer">
            {/*<p>
                            Copyright &copy;
                            <script>document.write(new Date().getFullYear());</script>
                            All rights reserved | This template is made with <i className="icon-heart"
                                                                                aria-hidden="true"></i> by <a
                                href="https://colorlib.com" target="_blank">Colorlib.com</a>
                           </p>*/}
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
              {/*<span className="sr-only">Toggle Menu</span>*/}
            </button>
            {/*<button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fa fa-bars"></i>
                        </button>*/}

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

        <CreateCustomerAccount hidden={menu.categorySelected !== 0} />
        <Recharge hidden={menu.categorySelected !== 1} />
        <History hidden={menu.categorySelected !== 2} />
      </div>
    </div>
  );
}
