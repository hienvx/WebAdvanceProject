import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    loginModel, updateValue, doLogin

} from "./LoginSlice";

/*import $ from 'jquery';*/


export function Login(props) {
    const dispatch = useDispatch();
    const login = useSelector(loginModel);

    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                History transaction
            </div>
            <div className="card-body">
                <form action="#">
                    <div className="form-group">
                        <label>User account</label>
                        <input type="text" className="form-control" value={login.userName}
                               onChange={(e)=>{dispatch(updateValue({value: e.target.value, option:["userName"]}))}}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" value={login.password}
                               onChange={(e)=>{dispatch(updateValue({value: e.target.value, option:["password"]}))}}/>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={()=>{
                        dispatch(doLogin());
                    }}>Login</button>
                </form>

            </div>
            <div className="card-footer text-muted">

            </div>

        </div>
    );
}