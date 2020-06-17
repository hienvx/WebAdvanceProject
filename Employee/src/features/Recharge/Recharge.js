import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    rechargeModel,
    updateAmount,
    updateNumberAccount,
    updateUserAccount,
    updateSelected,
    submit, back, resetValue
} from "./RechargeSlice";

import 'icheck-material/icheck-material.min.css'
/*import $ from 'jquery'*/
/*
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}*/

/*$.fn.digits = function(){
    return this.each(function(){
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
    })
}*/

export function Recharge(props) {
    const dispatch = useDispatch();
    const recharge = useSelector(rechargeModel);

    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Recharged account
            </div>
            <div className="card-body ">
                <form action="#">

                    <div className="form-check col-2 icheck-material-blue">
                        <input className="form-check-input" type="radio" id="materialUnchecked"
                               name="materialExampleRadios"
                               disabled={recharge.isSubmit}
                               onClick={() => dispatch(updateSelected(true))}
                               checked={recharge.isUserAccountChecked}/>
                        <label className="form-check-label" for="materialUnchecked">
                            User account
                        </label>
                    </div>

                    <div className="form-check col-4 icheck-material-blue">
                        <input className="form-check-input" type="radio"
                               id="materialChecked" name="materialExampleRadios"
                               disabled={recharge.isSubmit} onClick={() => dispatch(updateSelected(false))}
                               checked={!recharge.isUserAccountChecked}
                        />
                        <label className="form-check-label" for="materialChecked">
                            Number account
                        </label>
                    </div>

                    <br/>
                    <div className="form-group" hidden={!recharge.isUserAccountChecked}>
                        <label>User account</label>
                        <input type="text"
                               className="form-control"
                               readOnly={recharge.isSubmit}
                               onChange={e => {
                                   dispatch(updateUserAccount(e.target.value))
                               }}
                               value={recharge.userAccount}
                        />
                    </div>

                    <div className="form-group" hidden={recharge.isUserAccountChecked}>
                        <label>Number account</label>
                        <input type="text"
                               className="form-control"
                               readOnly={recharge.isSubmit}
                               onChange={e => {
                                   dispatch(updateNumberAccount(e.target.value))
                               }}
                               value={recharge.numberAccount}
                        />
                    </div>

                    <div className="form-group">
                        <label>Amount</label>
                        <input type="text" id={"inputAmount"}
                               className="form-control"
                               readOnly={recharge.isSubmit}
                               onChange={e => {
                                   dispatch(updateAmount(e.target.value));
                                   /*alert(e.target.value);
                                   $("#inputAmount").text(formatNumber(e.target.value));*/
                               }}
                               value={recharge.amount}
                        />
                    </div>

                    <input hidden={recharge.isSubmit} type="button" className="btn btn-primary" onClick={() => {
                        dispatch(submit());
                    }} value={"Submit"}>
                    </input>

                    <input
                        hidden={!recharge.isSubmit}
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            dispatch(back());
                        }} value={"Back"}/>

                    <input
                        hidden={recharge.isSubmit}
                        style={{"margin-left": "20px"}}
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            dispatch(resetValue());
                        }} value={"Clear"}/>

                    <label hidden={!recharge.isSubmit} style={{"color": "green", "margin-left": "50px"}}>Recharge
                        successful</label>

                    <label hidden={!recharge.isSubmit} style={{"color": "red", "margin-left": "50px"}}>Recharge
                        Failed</label>
                </form>

            </div>

            <div className="card-footer text-muted">

            </div>
        </div>
    );
}