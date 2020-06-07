import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
    historyModel,
    updateSelected,
    updateFilterAndSearch
} from "./HistorySlice";

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
                History transaction
            </div>
            <div className="card-body">
                <form action="#">

                    <div>
                        <h5 className="page-header">Transaction type</h5>

                        <div className="col-3">
                            <select className="form-control" onChange={e => {
                                let filter = {query: e.target.value, option:["type", "numberAccountFilter", "userAccountFilter"]};
                                dispatch(updateFilterAndSearch(filter));
                            }}>
                                <option value="0">Receive</option>
                                <option value="1">Transfers</option>
                                <option value="2">Payment</option>
                            </select>
                        </div>
                    </div>
                    <br/>


                    <div className="form-check col-2">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1"
                               value="option1" onChange={() => {
                            dispatch(updateSelected(false));
                        }} checked={!history.isUserAccountChecked}/>
                        <label className="form-check-label" htmlFor="exampleRadios1">
                            User account
                        </label>
                    </div>

                    <div className="form-check col-4">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2"
                               value="option2" onChange={() => {
                            dispatch(updateSelected(true));
                        }} checked={history.isUserAccountChecked}/>
                        <label className="form-check-label" htmlFor="exampleRadios2">
                            Number account
                        </label>
                    </div>

                    <br/>
                    <div className="form-group col-3" hidden={history.isUserAccountChecked}>
                        <label>User account</label>
                        <input type="text" className="form-control"
                               onChange={e => {

                                   let filter = {query: e.target.value, option:["userAccountFilter"]};

                                   clearTimeout(timer);
                                   let ms = 500; // milliseconds
                                   timer = setTimeout(function () {
                                       dispatch(updateFilterAndSearch(filter));
                                   }, ms);

                               }}/>
                    </div>

                    <div className="form-group col-3" hidden={!history.isUserAccountChecked}>
                        <label>Number account</label>
                        <input type="text" className="form-control"
                               onChange={e => {
                                   let filter = {query: e.target.value, option:["numberAccountFilter"]};

                                   clearTimeout(timer);
                                   let ms = 500; // milliseconds
                                   timer = setTimeout(function () {
                                       dispatch(updateFilterAndSearch(filter));
                                   }, ms);


                               }}/>
                    </div>

                    <table className="table" hidden={history.isUserAccountChecked}>
                        <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">User account</th>
                            <th scope="col">Type transaction</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Time</th>
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
                            <th scope="col">Number account</th>
                            <th scope="col">Type transaction</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Time</th>
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