import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectCategory} from "../../Menu/MenuSlice";
import {employeeModel, updateValueEmployee, doCreateEmployeeThunk, doUpdateEmployeeThunk} from "../FormEmployee/EmployeeSlice";
import {LoadingIndicator} from "../../History/History";
import {ClearAll} from "./EmployeeSlice";
import {doGetEmployeeThunk} from "../ManageSlice";



export function Employee(props) {
    const dispatch = useDispatch();
    const employee = useSelector(employeeModel);
    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Thông tin nhân viên
            </div>
            <div className="card-body">
                <form action="#">
                    <div className={"row d-flex justify-content-center"}>
                        <LoadingIndicator isLoading={employee.isLoading}/>
                    </div>
                    <div className="form-group col-8">

                        <div className="form-group" >
                            <label>Tài khoản</label>
                            <input type="text" className="form-control" placeholder={"Tài khoản"} disabled={employee.mode == 2}
                                   value={employee.profile.account}
                                   onChange={(e) => {
                                       dispatch(updateValueEmployee({value: e.target.value, option: ["account"]}))
                                   }}
                            />
                        </div>

                        <div className="form-group" hidden={employee.mode == 2 || employee.mode == 1}>
                            <label>Mật khẩu</label>
                            <input type="text" className="form-control" placeholder={"Mật khẩu"} disabled={employee.mode == 2}
                                   value={employee.profile.pass}
                                   onChange={(e) => {
                                       dispatch(updateValueEmployee({value: e.target.value, option: ["pass"]}))
                                   }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tên</label>
                            <input type="text" placeholder={"Tên"} disabled={employee.mode == 2}
                                   className="form-control"
                                   value={employee.profile.fullName}
                                   onChange={(e) => {
                                       dispatch(updateValueEmployee({value: e.target.value, option: ["fullName"]}))
                                   }}

                            />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ Email</label>
                            <input type="email" placeholder={"Địa chỉ Email"} disabled={employee.mode == 2}
                                   className="form-control"
                                   value={employee.profile.email}
                                   onChange={(e) => {
                                       dispatch(updateValueEmployee({value: e.target.value, option: ["email"]}))
                                   }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input type="text" placeholder={"Số điện thoại"} disabled={employee.mode == 2}
                                   className="form-control"
                                   value={employee.profile.phone}
                                   onChange={(e) => {
                                       dispatch(updateValueEmployee({value: e.target.value, option: ["phone"]}))
                                   }}

                            />
                        </div>
                        {
                            employee.mode == 0 ? <button type="button" style={{"marginRight": "20px"}} className="btn btn-primary" onClick={() => {
                                dispatch(doCreateEmployeeThunk());
                            }}>
                                Thêm mới
                            </button> : null
                        }

                        {
                            employee.mode == 1 ? <button type="button" style={{"marginRight": "20px"}} className="btn btn-primary" onClick={() => {
                                dispatch(doUpdateEmployeeThunk());
                            }}>
                                Cập nhật
                            </button> : null
                        }

                        {
                            employee.mode == 0 ?
                                <button type="button" className="btn btn-primary" style={{"marginRight": "20px"}}
                                        onClick={() => {
                                            dispatch(ClearAll());
                                        }}>
                                    Xoá tất cả
                                </button> : null
                        }


                        <button type="button" className="btn btn-primary" style={{"marginRight": "20px"}}
                                onClick={() => {
                                    dispatch(selectCategory(0));
                                    dispatch(doGetEmployeeThunk());
                                }}>
                            Quay về
                        </button>

                        <label hidden={employee.message == ""}
                               style={{"color": "red", "marginLeft": "50px"}}>{employee.message}</label>
                    </div>


                </form>

            </div>
            <div className="card-footer text-muted">

            </div>

        </div>
    );

}