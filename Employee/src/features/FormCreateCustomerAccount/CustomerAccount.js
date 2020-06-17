import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    customerModel,
    resetValue,
    updateValue, doSignUpThunk
} from "./CustomerAccountSlice";
import {doLoginThunk} from "../Login/LoginSlice";


export function CreateCustomerAccount(props) {
    const dispatch = useDispatch();
    let customer = useSelector(customerModel);


    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Tạo tài khoản khách hàng
            </div>
            <div className="card-body">
                <form action="#">
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input readOnly={customer.isSubmit}
                               type="text"
                               className="form-control"
                               onChange={e => dispatch(updateValue({value: e.target.value, option:["userName"]}))}
                               value={customer.userName}
                        />
                    </div>

                    <div className="form-group">
                        <label>Số dư</label>
                        <input readOnly={customer.isSubmit}
                               type="text"
                               className="form-control"
                               onChange={e => dispatch(updateValue({value: e.target.value, option:["currentBalance"]}))}
                               value={customer.paymentAccount.currentBalance}
                        />
                    </div>

                    <div className="form-group" hidden={!customer.isSubmit}>
                        <label>Mật khẩu</label>
                        <input readOnly={customer.isSubmit}
                               type="text"
                               className="form-control"
                               value={customer.password}
                        />
                    </div>

                    {/*<div className="form-group">
                        <label>Re-Password</label>
                        <input type="password" className="form-control"/>
                    </div>*/}
                    <h3>Thông tin cá nhân</h3>

                    <div className="form-group">
                        <label>Họ tên</label>
                        <input readOnly={customer.isSubmit} required
                               type="text"
                               className="form-control"
                               onChange={e => {
                                   dispatch(updateValue({value: e.target.value, option:["fullName"]}));
                               }}
                               value={customer.fullName}
                        />
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ email</label>
                        <input readOnly={customer.isSubmit} required
                               type="email"
                               className="form-control"
                               onChange={e => dispatch(updateValue({value: e.target.value, option:["email"]}))}
                               value={customer.email}

                        />
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input readOnly={customer.isSubmit} required
                               type="phone"
                               className="form-control"
                               onChange={e => dispatch(updateValue({value: e.target.value, option:["phone"]}))}
                               value={customer.phone}
                        />
                    </div>

                    <button hidden={customer.isSubmit}  type="button" className="btn btn-primary" onClick={async () => {
                        dispatch(doSignUpThunk());
                    }}>
                        <span hidden={customer.isLoading}>Đăng ký</span>
                        <span hidden={!customer.isLoading} className="spinner-border text-dark">
                            </span>
                    </button>


                    <input hidden={!customer.isSubmit} type="button" className="btn btn-primary" onClick={() => {

                        dispatch(updateValue({value: false, option:["isSubmit"]}));
                    }} value={"Quay về"}/>

                    <input style={{"marginLeft": "20px"}}
                           hidden={customer.isSubmit}
                           type="button"
                           className="btn btn-primary"
                           onClick={() => {
                               dispatch(resetValue());
                           }} value={"Xoá"}/>

                    <label hidden={!customer.isSubmit} style={{"color": "red", "marginLeft": "50px"}}>{customer.message}</label>
                </form>

            </div>
            <div className="card-footer text-muted">

            </div>
        </div>
    );
}