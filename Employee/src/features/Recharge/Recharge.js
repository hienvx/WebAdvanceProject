import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    rechargeModel,
    updateValue,
    resetValue,
    doPaymentNumberAccountThunk,
    doPaymentUserAccountThunk,
    doGetNumberAccountThunk,
    doGetUserAccountThunk
} from "./RechargeSlice";

import 'icheck-material/icheck-material.min.css'

export function Recharge(props) {
    const dispatch = useDispatch();
    const recharge = useSelector(rechargeModel);
    let timer;
    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Nạp tiền cho khách hàng
            </div>
            <div className="card-body ">
                <form action="#">

                    <div className="form-check col-2 icheck-material-blue">
                        <input className="form-check-input" type="radio" id="materialUnchecked"
                               name="materialExampleRadios"
                               disabled={recharge.isSubmit}
                               onClick={() => {
                                   dispatch(updateValue({value: true, option: ["isUserAccountChecked"]}))
                                   dispatch(doGetUserAccountThunk());
                               }
                               }
                               onChange={()=>{}}
                               checked={recharge.isUserAccountChecked}/>
                        <label className="form-check-label" htmlFor="materialUnchecked">
                            Tài khoản
                        </label>
                    </div>

                    <div className="form-check col-4 icheck-material-blue">
                        <input className="form-check-input" type="radio"
                               id="materialChecked" name="materialExampleRadios"
                               disabled={recharge.isSubmit}
                               onChange={()=>{}}
                               onClick={() => {
                                   dispatch(updateValue({value: false, option: ["isUserAccountChecked"]}));
                                   dispatch(doGetNumberAccountThunk());
                               }}
                               checked={!recharge.isUserAccountChecked}
                        />
                        <label className="form-check-label" htmlFor="materialChecked">
                            Số tài khoản
                        </label>
                    </div>

                    <br/>
                    <div className="form-group" hidden={!recharge.isUserAccountChecked}>
                        <label>Tài khoản</label>
                        <input type="text"
                               className="form-control"
                               readOnly={recharge.isSubmit}
                               onChange={e => {

                                   let filter = {value: e.target.value, option: ["userAccount"]};

                                   clearTimeout(timer);
                                   let ms = 1000; // milliseconds
                                   timer = setTimeout(function () {
                                       dispatch(updateValue(filter))
                                       dispatch(doGetUserAccountThunk());
                                   }, ms);


                               }}

                        />
                    </div>

                    <div className="form-group" hidden={recharge.isUserAccountChecked}>
                        <label>Số tài khoản</label>
                        <input type="text"
                               className="form-control"
                               readOnly={recharge.isSubmit}
                               onChange={e => {

                                   let filter = {value: e.target.value, option: ["numberAccount"]};

                                   clearTimeout(timer);
                                   let ms = 1000; // milliseconds
                                   timer = setTimeout(function () {
                                       dispatch(updateValue(filter))
                                       dispatch(doGetNumberAccountThunk());
                                   }, ms);


                               }}

                        />
                    </div>

                    <div className="form-group">
                        <label>Số tiền</label>
                        <input type="text" id={"inputAmount"}
                               className="form-control"
                               readOnly={recharge.isSubmit}
                               onChange={e => {
                                   dispatch(updateValue({value: e.target.value, option: ["amount"]}));
                                   /*alert(e.target.value);
                                   $("#inputAmount").text(formatNumber(e.target.value));*/
                               }}
                               value={recharge.amount}
                        />
                    </div>


                    <button hidden={recharge.isSubmit} type="button" className="btn btn-primary" onClick={async () => {
                        if (recharge.isUserAccountChecked) {
                            dispatch(doPaymentUserAccountThunk())
                        } else {
                            dispatch(doPaymentNumberAccountThunk())
                        }

                    }}>
                        <span hidden={recharge.isLoading}>Nạp tiền</span>
                        <span hidden={!recharge.isLoading} className="spinner-border text-dark">
                            </span>
                    </button>

                    <input
                        hidden={!recharge.isSubmit}
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            dispatch(updateValue({value: false, option: ["isSubmit"]}));
                        }} value={"Quay về"}/>

                    <input
                        hidden={recharge.isSubmit}
                        style={{"marginLeft": "20px"}}
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            dispatch(resetValue());
                        }} value={"Xoá"}/>

                    <label hidden={recharge.message == ""}
                           style={{"color": "red", "marginLeft": "50px"}}>{recharge.message}</label>
                </form>

            </div>

            <div className="card-footer text-muted">

            </div>
        </div>
    );
}