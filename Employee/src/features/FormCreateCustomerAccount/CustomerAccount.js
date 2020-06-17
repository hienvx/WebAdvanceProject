import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    customerModel,
    resetValue,
    submit,
    updateEmail,
    updateFullName,
    updatePhone,
    updateUserName
} from "./CustomerAccountSlice";


export function CreateCustomerAccount(props) {
    const dispatch = useDispatch();
    let customer = useSelector(customerModel);


    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Sign up customer account
            </div>
            <div className="card-body">
                <form action="#">
                    <div className="form-group">
                        <label>User name</label>
                        <input readOnly={customer.isSubmit}
                               type="text"
                               className="form-control"
                               onChange={e => dispatch(updateUserName(e.target.value))}
                               value={customer.userName}
                        />
                    </div>
                    <div className="form-group" hidden={!customer.isSubmit}>
                        <label>Password</label>
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
                    <h3>Profile</h3>

                    <div className="form-group">
                        <label>Full name</label>
                        <input readOnly={customer.isSubmit} required
                               type="text"
                               className="form-control"
                               onChange={e => {
                                   dispatch(updateFullName(e.target.value));
                               }}
                               value={customer.fullName}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input readOnly={customer.isSubmit} required
                               type="email"
                               className="form-control"
                               onChange={e => dispatch(updateEmail(e.target.value))}
                               value={customer.email}

                        />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <input readOnly={customer.isSubmit} required
                               type="phone"
                               className="form-control"
                               onChange={e => dispatch(updatePhone(e.target.value))}
                               value={customer.phone}
                        />
                    </div>

                    <input hidden={customer.isSubmit}
                           type="button"
                           className="btn btn-primary"
                           onClick={() => {
                               dispatch(submit(true));
                           }} value={"Submit"}

                    />

                    <input hidden={!customer.isSubmit} type="button" className="btn btn-primary" onClick={() => {
                        dispatch(submit(false));
                    }} value={"Back"}/>

                    <input style={{"margin-left": "20px"}}
                           hidden={customer.isSubmit}
                           type="button"
                           className="btn btn-primary"
                           onClick={() => {
                               dispatch(resetValue());
                           }} value={"Clear"}/>

                    <label hidden={!customer.isSubmit} style={{"color": "green", "margin-left": "50px"}}>Sign up
                        successful</label>
                    <label hidden={!customer.isSubmit} style={{"color": "red", "margin-left": "50px"}}>Sign up
                        failed</label>
                </form>

            </div>
            <div className="card-footer text-muted">

            </div>
        </div>
    );
}