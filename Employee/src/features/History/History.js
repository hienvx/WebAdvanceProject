import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {historyModel, updateSelected} from "./HistorySlice";

/*import Pagination from 'rc-pagination';*/

export function History() {
    const dispatch = useDispatch();
    const history = useSelector(historyModel);
    return (
        <div className="card text-left">
            <div className="card-header">
                Recharge
            </div>
            <div className="card-body">
                <form action="#">

                    <div>
                        <h5 className="page-header">Transaction type</h5>

                        <div className="col-3">
                            <select className="form-control">
                                <option value="Receive">Receive</option>
                                <option value="Transfers">Transfers</option>
                                <option value="Payment">Payment</option>
                            </select>
                        </div>
                    </div>
                    <br/>
                    <div className={""}>
                        <div className="form-check  form-check-inline col-2">
                            <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1"
                                   value="option1" onChange={() => {
                                       dispatch(updateSelected(false));
                            }} checked={!history.isUserAccountChecked}/>
                            <label className="form-check-label" htmlFor="exampleRadios1">
                                User account
                            </label>
                        </div>

                        <div className="form-check  form-check-inline col-4">
                            <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2"
                                   value="option2" onChange={() => {
                                dispatch(updateSelected(true));
                            }} checked={history.isUserAccountChecked}/>
                            <label className="form-check-label" htmlFor="exampleRadios2">
                                Number account
                            </label>
                        </div>
                    </div>
                    <br/>
                    <div className="form-group col-3" hidden={history.isUserAccountChecked}>
                        <label>User account</label>
                        <input type="text" className="form-control"
                               onChange={e => {
                               }}/>
                    </div>

                    <div className="form-group col-3" hidden={!history.isUserAccountChecked}>
                        <label>Number account</label>
                        <input type="text" className="form-control"
                               onChange={e => {
                               }}/>
                    </div>

                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Handle</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>

                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>

                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
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