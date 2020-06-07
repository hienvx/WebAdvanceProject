import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    rechargeModel,
    updateAmount,
    updateNumberAccount,
    updateUserAccount,
    updateSelected,
    submit
} from "./RechargeSlice";

/*import $ from 'jquery'

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}*/
export function Recharge(props) {
    const dispatch = useDispatch();
    const recharge = useSelector(rechargeModel)
    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Recharged account
            </div>
            <div className="card-body">
                <form action="#">

                    <div className="form-check col-2">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1"
                               disabled={recharge.isSubmit}
                               value="option1" onChange={() => dispatch(updateSelected(true))}
                               checked={recharge.isUserAccountChecked}/>
                        <label className="form-check-label" htmlFor="exampleRadios1">
                            User account
                        </label>
                    </div>

                    <div className="form-check col-4">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2"
                               disabled={recharge.isSubmit}
                               value="option2" onChange={() => dispatch(updateSelected(false))}
                               checked={!recharge.isUserAccountChecked}
                        />
                        <label className="form-check-label" htmlFor="exampleRadios2">
                            Number account
                        </label>
                    </div>

                    <br/>
                    <div className="form-group" hidden={!recharge.isUserAccountChecked}>
                        <label>User account</label>
                        <input type="text" className="form-control" readOnly={recharge.isSubmit}
                               onChange={e => {
                                   dispatch(updateUserAccount(e.target.value))
                               }}/>
                    </div>

                    <div className="form-group" hidden={recharge.isUserAccountChecked}>
                        <label>Number account</label>
                        <input type="text" className="form-control" readOnly={recharge.isSubmit}
                               onChange={e => {
                                   dispatch(updateNumberAccount(e.target.value))
                               }}/>
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

                               }}/>
                    </div>

                    <input hidden={recharge.isSubmit} type="button" className="btn btn-primary" onClick={() => {
                        dispatch(submit());
                    }} value={"Submit"}>
                    </input>

                    <input hidden={!recharge.isSubmit} type="button" className="btn btn-primary" onClick={() => {
                        window.location.reload();
                    }} value={"Back"}/>
                    <label hidden={!recharge.isSubmit} style={{"color": "green", "margin-left": "50px"}}>Recharge
                        successful</label>
                </form>

            </div>
            <div className="card-footer text-muted">

            </div>
        </div>
    );
}