import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    loginModel, updateValue, doLoginThunk

} from "./LoginSlice";



export function Login(props) {
    const dispatch = useDispatch();
    const login = useSelector(loginModel);

    return (
        <div>
            <div className="card text-left" hidden={props.hidden}>
                <div className="card-header">
                    History transaction
                </div>
                <div className="card-body">
                    <form action="#">
                        <div className="form-group">
                            <label>User account</label>
                            <input type="text" className="form-control" value={login.userName}
                                   onChange={(e) => {
                                       dispatch(updateValue({value: e.target.value, option: ["userName"]}))
                                   }}/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" value={login.password}
                                   onChange={(e) => {
                                       dispatch(updateValue({value: e.target.value, option: ["password"]}))
                                   }}/>
                        </div>
                        <button  type="button" className="btn btn-primary" onClick={async () => {
                            dispatch(doLoginThunk());
                        }}>
                            <span hidden={login.isLoading}>Login</span>
                            <span hidden={!login.isLoading} className="spinner-border text-dark">
                            </span>
                        </button>

                        <label hidden={login.message == ""} style={{"color": "red", "marginLeft": "50px"}}>{login.message}</label>
                    </form>

                </div>
                <div className="card-footer text-muted">

                </div>

            </div>
        </div>
    );
}