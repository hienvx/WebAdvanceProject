import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Loader from "react-loader-spinner";
import Pagination from "react-bootstrap/Pagination";
import {
    doGetHistoryTransactionThunk,
    historyModel,
    updateValue,
} from "./HistorySlice";
const axios = require("axios").default;
let moment = require("moment");

let typeTransaction = ["Chuyển khoản", "Nạp tiền", "Rút tiền", "Nhận tiền"];

function RowItem(props) {
    return (
        <tr>
            <th scope="row">{props.stt}</th>
            <td>{props.data.account}</td>
            <td>{props.data.bank}</td>
            <td>{typeTransaction[props.data.type]}</td>
            <td>{props.data.amount}</td>
            <td>{moment(props.data.time * 1000).format("DD-MM-YYYY")}</td>
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
                <th scope="col">Ngân hàng</th>
                <th scope="col">Loại giao dịch</th>
                <th scope="col">Số tiền</th>
                <th scope="col">Ngày</th>
            </tr>
            </thead>
            <tbody>
            {data.map((value, index) => {
                return <RowItem stt={index + 1} data={value} key={index + 1}/>;
            })}
            </tbody>
        </table>
    );
}

export const LoadingIndicator = (props) => {
    return (
        props.isLoading && (
            <div>
                <Loader type="ThreeDots" color="#f8b739" height="100" width="100"/>
            </div>
        )
    );
};


export function History(props) {
    const dispatch = useDispatch();
    const history = useSelector(historyModel);

    if (history.isStart) {
        dispatch(doGetHistoryTransactionThunk());
    }
console.log(localStorage.getItem("numberAccountCustomer"))
    dispatch(updateValue({
        value: localStorage.getItem("numberAccountCustomer"),
        option: ["filter"],
    }));
    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">Lịch sử giao dịch</div>
            <div className="card-body">
                <form action="#">
                    <div>
                        <div className="col-3">
                            <label>Loại giao dịch</label>
                            <select
                                className="form-control"
                                onChange={(e) => {
                                    let filter = {
                                        value: e.target.value,
                                        option: ["type"],
                                    };

                                    dispatch(updateValue(filter));
                                    dispatch(doGetHistoryTransactionThunk());
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

                    <br/>

                    {/*<div className="form-group col-3">
            <label>Tài khoản</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                let filter = { value: e.target.value, option: ["filter"] };

                clearTimeout(timer);
                let ms = 500; // milliseconds
                timer = setTimeout(function () {
                  dispatch(updateValue(filter));
                  dispatch(doGetHistoryTransactionThunk());
                }, ms);
              }}
              value={""}
            />
          </div>*/}

                    <div className={"row"}>
                        <div className="col-8">
                            <h3>Tổng số giao dịch: {history.totalData}</h3>
                        </div>
                    </div>

                    <div className={"row d-flex justify-content-center"}>
                        <LoadingIndicator isLoading={history.isLoading}/>
                    </div>

                    <Items data={history.dataUserAccount}/>

                    <div className={"row d-flex justify-content-center"}>
                        <Pagination hidden={history.totalPage < 2}>
                            <Pagination.First
                                onClick={() => {
                                    dispatch(updateValue({value: 1, option: ["currentPage"]}));
                                    dispatch(doGetHistoryTransactionThunk());
                                }}
                            />
                            <Pagination.Prev
                                onClick={() => {
                                    dispatch(
                                        updateValue({
                                            value: history.currentPage - 1,
                                            option: ["currentPage"],
                                        })
                                    );
                                    dispatch(doGetHistoryTransactionThunk());
                                }}
                            />
                            <Pagination.Ellipsis
                                disabled={true}
                                hidden={history.currentPage <= 2}
                            />

                            <Pagination.Item
                                hidden={history.currentPage <= 1}
                                onClick={() => {
                                    dispatch(
                                        updateValue({
                                            value: history.currentPage - 1,
                                            option: ["currentPage"],
                                        })
                                    );
                                    dispatch(doGetHistoryTransactionThunk());
                                }}
                            >
                                {history.currentPage - 1}
                            </Pagination.Item>
                            <Pagination.Item active>{history.currentPage}</Pagination.Item>
                            <Pagination.Item
                                hidden={history.currentPage >= history.totalPage - 2}
                                onClick={() => {
                                    dispatch(
                                        updateValue({
                                            value: history.currentPage + 1,
                                            option: ["currentPage"],
                                        })
                                    );
                                    dispatch(doGetHistoryTransactionThunk());
                                }}
                            >
                                {history.currentPage + 1}
                            </Pagination.Item>

                            <Pagination.Ellipsis
                                disabled={true}
                                hidden={history.currentPage >= history.totalPage - 1}
                            />
                            <Pagination.Item
                                hidden={history.currentPage === history.totalPage}
                                onClick={() => {
                                    dispatch(
                                        updateValue({
                                            value: history.totalPage,
                                            option: ["currentPage"],
                                        })
                                    );
                                    dispatch(doGetHistoryTransactionThunk());
                                }}
                            >
                                {history.totalPage}
                            </Pagination.Item>
                            <Pagination.Next
                                onClick={() => {
                                    dispatch(
                                        updateValue({
                                            value: history.currentPage + 1,
                                            option: ["currentPage"],
                                        })
                                    );
                                    dispatch(doGetHistoryTransactionThunk());
                                }}
                            />
                            <Pagination.Last
                                onClick={() => {
                                    dispatch(
                                        updateValue({
                                            value: history.totalPage,
                                            option: ["currentPage"],
                                        })
                                    );
                                    dispatch(doGetHistoryTransactionThunk());
                                }}
                            />
                        </Pagination>
                    </div>
                </form>
            </div>
            <div className="card-footer text-muted"></div>
        </div>
    );
}
