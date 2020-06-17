import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    historyModel,
    updateSelected,
    updateFilterAndSearch, searchUserAccount, searchNumberAccount
} from "./HistorySlice";

/*
import 'icheck-material/icheck-material.min.css'
*/

/*import Pagination from 'rc-pagination';*/
function RowItem(props) {
    return (
        <tr>
            <th scope="row">{props.stt}</th>
            <td>{props.data.account}</td>
            <td>{props.data.type}</td>
            <td>{props.data.amount}</td>
            <td>{props.data.time}</td>
        </tr>
    );
}

function Items(props) {
    let data = props.data;
    return (

        data.map((value, index) => {
            return <RowItem stt={index + 1} data={value}/>
        })
    );
}

export function History(props) {
    const dispatch = useDispatch();
    const history = useSelector(historyModel);
    let timer;

    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Lịch sử giao dich
            </div>
            <div className="card-body">
                <form action="#">

                    <div className="form-check col-2 icheck-material-blue">
                        <input className="form-check-input"
                               type="radio"
                               id="materialUnchecked1" name="materialExampleRadios1"
                               onChange={() => {
                                   dispatch(updateSelected(true));
                               }}
                               checked={history.isUserAccountChecked}/>
                        <label className="form-check-label" htmlFor="materialUnchecked1">
                            Tài khoản
                        </label>
                    </div>

                    <div className="form-check col-4 icheck-material-blue">
                        <input className="form-check-input"
                               type="radio"
                               onChange={() => {
                                   dispatch(updateSelected(false));
                               }}
                               id="materialChecked1" name="materialExampleRadios1"
                               checked={!history.isUserAccountChecked}/>
                        <label className="form-check-label" htmlFor="materialChecked1">
                            Số tài khoản
                        </label>
                    </div>

                    <div hidden={history.isUserAccountChecked}>
                        <h5 className="page-header">Loại giao dịch</h5>

                        <div className="col-3">
                            <select className="form-control" onChange={e => {
                                let filter = {
                                    query: e.target.value,
                                    option: ["type"]
                                };

                                dispatch(searchUserAccount(filter));
                            }}
                                    value={history.userAccountFilter.type}
                            >
                                <option value="0">Chuyển khoản</option>
                                <option value="1">Nạp tiền</option>
                                <option value="2">Rút tiền</option>
                                <option value="3">Nhận tiền</option>
                            </select>
                        </div>
                    </div>

                    <div hidden={!history.isUserAccountChecked}>
                        <h5 className="page-header">Loại giao dịch</h5>

                        <div className="col-3">
                            <select className="form-control" onChange={e => {
                                let filter = {
                                    query: e.target.value,
                                    option: ["type"]
                                };
                                dispatch(searchNumberAccount(filter));
                            }}
                                    value={history.numberAccountFilter.type}
                            >
                                <option value="0">Chuyển khoản</option>
                                <option value="1">Nạp tiền</option>
                                <option value="2">Rút tiền</option>
                                <option value="3">Nhận tiền</option>
                            </select>
                        </div>
                    </div>

                    <br/>

                    <div className="form-group col-3" hidden={history.isUserAccountChecked}>
                        <label>Tài khoản</label>
                        <input type="text" className="form-control"

                               onChange={e => {

                                   let filter = {query: e.target.value, option: ["filter"]};

                                   clearTimeout(timer);
                                   let ms = 500; // milliseconds
                                   timer = setTimeout(function () {
                                       dispatch(searchUserAccount(filter));
                                   }, ms);

                               }}/>
                    </div>

                    <div className="form-group col-3" hidden={!history.isUserAccountChecked}>
                        <label>Số tài khoản</label>
                        <input type="text" className="form-control"

                               onChange={e => {
                                       let filter = {query: e.target.value, option: ["filter"]};

                                       clearTimeout(timer);
                                       let ms = 500; // milliseconds
                                       timer = setTimeout(function () {
                                           dispatch(searchNumberAccount(filter));
                                       }, ms);


                                   }}/>
                    </div>

                    <table className="table" hidden={history.isUserAccountChecked}>
                        <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Tài khoản</th>
                            <th scope="col">Loại giao dịch</th>
                            <th scope="col">Số tiền</th>
                            <th scope="col">Ngày</th>
                        </tr>
                        </thead>
                        <tbody>
                        <Items data={history.dataUserAccount}/>

                        </tbody>
                    </table>

                    <table className="table" hidden={!history.isUserAccountChecked}>
                        <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Tài khoản</th>
                            <th scope="col">Loại giao dịch</th>
                            <th scope="col">Số tiền</th>
                            <th scope="col">Ngày</th>
                        </tr>
                        </thead>
                        <tbody>
                        <Items data={history.dataNumberAccount}/>

                        </tbody>
                    </table>

                    {/*<Pagination
                        pageSize={10}
                    />*/}
                </form>

            </div>
            <div className="card-footer text-muted">

            </div>
        </div>
    );
}