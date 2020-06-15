import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    doGetDataThunk,
    historyModel,
    searchUserAccount
} from "./HistorySlice";

let typeTransaction = ["Chuyển khoản", "Nạp tiền", "Rút tiền", "Nhận tiền"];

function RowItem(props) {
    return (
        <tr>
            <th scope="row">{props.stt}</th>
            <td>{props.data.bank}</td>
            <td>{props.data.account}</td>
            <td>{typeTransaction[props.data.type]}</td>
            <td>{props.data.amount}</td>
            <td>{props.data.time}</td>
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
                <th scope="col">Bank</th>
                <th scope="col">User account</th>
                <th scope="col">Type transaction</th>
                <th scope="col">Amount</th>
                <th scope="col">Time</th>
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

export function History(props) {
    const dispatch = useDispatch();
    const history = useSelector(historyModel);
    /*    let filter = {
            query: "all",
            option: ["bankSelected"]
        };
        dispatch(searchUserAccount(filter));*/
    if(history.isStart){
        dispatch(doGetDataThunk());
    }
    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                History transaction
            </div>
            <div className="card-body">
                <form action="#">

                    <div className={"row"}>
                        <div className="form-group col-3">
                            <input type="date" className="form-control"
                                   value={history.userAccountFilter.dateStart}
                                   onChange={e => {
                                       let filter = {
                                           query: e.target.value,
                                           option: ["dateStart"]
                                       };

                                       dispatch(searchUserAccount(filter));
                                   }}/>
                        </div>
                        <span>~</span>
                        <div className="form-group col-3">

                            <input type="date" className="form-control"
                                   value={history.userAccountFilter.dateEnd}
                                   onChange={e => {
                                       let filter = {
                                           query: e.target.value,
                                           option: ["dateEnd"]
                                       };
                                       dispatch(searchUserAccount(filter));
                                   }}/>
                        </div>

                    </div>


                    <div className={"row"}>
                        <div className="col-3">
                            <select className="form-control" onChange={e => {
                                let filter = {
                                    query: e.target.value,
                                    option: ["bankSelected"]
                                };

                                dispatch(searchUserAccount(filter));
                            }}
                                    value={history.userAccountFilter.bankSelected}
                            >
                                <option value={"all"}>All</option>
                                {history.banks.map((value, index) => {
                                    return <option value={value.name}>{value.name}</option>
                                })}

                            </select>
                        </div>
                    </div>
                    <br/>
                    <div className={"row"}>
                        <div className="col-3">
                            <h3>Total: {history.total}</h3>
                        </div>
                    </div>

                    <br/>
                    <Items data={history.dataUserAccount}/>

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