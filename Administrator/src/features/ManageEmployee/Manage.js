import {selectCategory} from "../Menu/MenuSlice";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {manageModel, updateValue, doGetEmployeeThunk, doDeleteEmployeeThunk} from "./ManageSlice";
import {LoadingIndicator} from "../History/History";
import Pagination from "react-bootstrap/Pagination";
import {ClearAll, setEmployee, updateValueEmployee} from "./FormEmployee/EmployeeSlice";

let moment = require('moment');

function RowItem(props) {
    let dispatch = useDispatch();
    return (
        <tr>
            <th scope="row">{props.stt}</th>
            <td>{props.data.account}</td>
            <td>{props.data.profile.fullName}</td>
            <td>{props.data.profile.email}</td>
            <td>{props.data.profile.phone}</td>
            <td>{moment(props.data.time * 1000).format("DD-MM-YYYY")}</td>
            <td scope="col">
                <button type="button" className="btn btn-primary fa fa-eye" onClick={() => {
                    dispatch(updateValueEmployee({value: 2, option: ["mode"]}));
                    dispatch(setEmployee(props.data));
                    dispatch(selectCategory(2));
                }}>
                </button>
            </td>
            <td scope="col">
                <button type="button" className="btn btn-primary fa fa-edit" onClick={() => {
                    dispatch(updateValueEmployee({value: 1, option: ["mode"]}));
                    dispatch(setEmployee(props.data));
                    dispatch(selectCategory(2));
                }}>
                </button>
            </td>
            <td scope="col">
                <button type="button" className="btn btn-primary fa fa-trash"
                        onClick={() => {
                            dispatch(doDeleteEmployeeThunk(props.data.account)).then(() => {
                                dispatch(doGetEmployeeThunk());
                            });

                        }}>
                </button>
            </td>
        </tr>
    );
}

function Items(props) {
    let data = props.data;
    return (

        <table className="table">
            <thead>
            <tr>
                <th scope="col"></th>
                <th scope="col">Tài khoản</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Ngày cập nhật</th>
                <th scope="col"></th>
                <th scope="col"></th>

            </tr>
            </thead>
            <tbody>

            {data.map((value, index) => {
                return <RowItem stt={index + 1} data={value}/>
            })}


            </tbody>


        </table>
    );
}

export function Manage(props) {
    const manage = useSelector(manageModel);
    const dispatch = useDispatch();
    let timer;

    if (manage.isStart) {
        dispatch(doGetEmployeeThunk());
    }
    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Quản lý nhân viên
            </div>
            <div className="card-body">
                <form action="#">

                    <div className="form-group col-8">
                        <input type="text" className="form-control"
                               placeholder={"Tìm kiếm nhân viên"}
                            /*value={manage.userAccountFilter.account}*/
                               onChange={e => {
                                   let filter = {
                                       value: e.target.value,
                                       option: ["account"]
                                   };
                                   dispatch(updateValue(filter));

                                   clearTimeout(timer);
                                   let ms = 1000; // milliseconds
                                   timer = setTimeout(function () {
                                       dispatch(doGetEmployeeThunk());
                                   }, ms);

                               }}
                        />
                        <br/>
                        <button type="button" className="btn btn-primary" onClick={() => {
                            dispatch(ClearAll());
                            dispatch(updateValueEmployee({value: 0, option: ["mode"]}));
                            dispatch(selectCategory(2));
                        }}>
                            Thêm nhân viên mới
                        </button>
                        <br/>
                        <div className={"row"}>
                            <div className="col-8">
                                <h5>Tìm thấy: {manage.total} nhân viên</h5>
                            </div>
                        </div>

                    </div>


                    <div className={"row d-flex justify-content-center"}>
                        <LoadingIndicator isLoading={manage.isLoading}/>
                    </div>

                    <Items data={manage.dataUserAccount}/>

                    <div className={"row d-flex justify-content-center"}>
                        <Pagination hidden={manage.totalPage < 2}>
                            <Pagination.First
                                onClick={() => {
                                    dispatch(updateValue({value: 1, option: ["currentPage"]}))
                                    dispatch(doGetEmployeeThunk());
                                }}/>
                            <Pagination.Prev
                                onClick={() => {
                                    dispatch(updateValue({value: manage.currentPage - 1, option: ["currentPage"]}))
                                    dispatch(doGetEmployeeThunk());
                                }}/>
                            <Pagination.Ellipsis disabled={true} hidden={manage.currentPage <= 2}/>

                            <Pagination.Item
                                hidden={manage.currentPage <= 1}
                                onClick={() => {
                                    dispatch(updateValue({value: manage.currentPage - 1, option: ["currentPage"]}))
                                    dispatch(doGetEmployeeThunk());
                                }}
                            >{manage.currentPage - 1}</Pagination.Item>
                            <Pagination.Item active>{manage.currentPage}</Pagination.Item>
                            <Pagination.Item
                                hidden={manage.currentPage >= manage.totalPage - 2}
                                onClick={() => {
                                    dispatch(updateValue({value: manage.currentPage + 1, option: ["currentPage"]}))
                                    dispatch(doGetEmployeeThunk());
                                }}
                            >{manage.currentPage + 1}</Pagination.Item>

                            <Pagination.Ellipsis disabled={true} hidden={manage.currentPage >= manage.totalPage - 1}/>
                            <Pagination.Item
                                hidden={manage.currentPage == manage.totalPage}
                                onClick={() => {
                                    dispatch(updateValue({value: manage.totalPage, option: ["currentPage"]}))
                                    dispatch(doGetEmployeeThunk());
                                }}
                            >{manage.totalPage}</Pagination.Item>
                            <Pagination.Next onClick={() => {
                                dispatch(updateValue({value: manage.currentPage + 1, option: ["currentPage"]}))
                                dispatch(doGetEmployeeThunk());
                            }}/>
                            <Pagination.Last onClick={() => {
                                dispatch(updateValue({value: manage.totalPage, option: ["currentPage"]}))
                                dispatch(doGetEmployeeThunk());
                            }}/>
                        </Pagination>
                    </div>

                </form>

            </div>
            <div className="card-footer text-muted">

            </div>

        </div>
    );

}