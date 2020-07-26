import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginModel, updateValue, doLoginThunk } from "./LoginSlice";
import ReCAPTCHA from "react-google-recaptcha";

export function Login(props) {
  const recaptchaRef = React.createRef();
  const dispatch = useDispatch();
  const login = useSelector(loginModel);
  const onSubmit = () => {
    const recaptchaValue = recaptchaRef.current.getValue();
    this.props.onSubmit(recaptchaValue);
  };

  function onChange(value) {
    console.log("Captcha value:", value);
    dispatch(updateValue({ value: value, option: ["recaptchaToken"] }));
  }

  return (
    <div className={"col-4 login-center"}>
      <div className="card text-left" hidden={props.hidden}>
        <div className="card-header">Đăng nhập</div>
        <div className="card-body">
          <form action="#">
            <div className="form-group">
              <label>Tài khoản</label>
              <input
                type="text"
                className="form-control"
                value={login.userName}
                onChange={(e) => {
                  dispatch(
                    updateValue({ value: e.target.value, option: ["userName"] })
                  );
                }}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={login.password}
                onChange={(e) => {
                  dispatch(
                    updateValue({ value: e.target.value, option: ["password"] })
                  );
                }}
              />
            </div>
            <ReCAPTCHA
              sitekey="6LdY57UZAAAAAEp-pM98sCnvFZTPILCKjnWn6EH5"
              onChange={onChange}
              style={{ margin: 10 }}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                dispatch(doLoginThunk());
              }}
            >
              <span hidden={login.isLoading}>Đăng nhập</span>
              <span
                hidden={!login.isLoading}
                className="spinner-border text-dark"
              ></span>
            </button>

            <label
              hidden={login.message === ""}
              style={{ color: "red", marginLeft: "50px" }}
            >
              {login.message}
            </label>
          </form>
        </div>
        <div className="card-footer text-muted"></div>
      </div>
    </div>
  );
}
