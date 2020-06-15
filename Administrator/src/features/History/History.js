import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import Loader from 'react-loader-spinner';
import Pagination from 'react-bootstrap/Pagination'
import {
    doGetDataThunk,
    historyModel,
    updateValue
} from "./HistorySlice";

let moment = require('moment');

let typeTransaction = ["Chuyển khoản", "Nạp tiền", "Rút tiền", "Nhận tiền"];

function RowItem(props) {
    return (
        <tr>
            <th scope="row">{props.stt}</th>
            <td>{props.data.bank}</td>
            <td>{props.data.account}</td>
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
                <th scope="col">Ngân hàng</th>
                <th scope="col">Tài khoản</th>
                <th scope="col">Loại giao dịch</th>
                <th scope="col">Số tiền</th>
                <th scope="col">Ngày</th>
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

const LoadingIndicator = props => {
    return props.isLoading &&

        <div>
            <Loader type="ThreeDots" color="#f8b739" height="100" width="100"/>
        </div>
};


export function History(props) {
    const dispatch = useDispatch();
    const history = useSelector(historyModel);

    if (history.isStart) {
        dispatch(doGetDataThunk());
    }
    /*    let a = moment("2020-05-15").unix()
      alert(a);
       alert(moment(a*1000).format("DD-MM-YYYY"));*/
    return (
        <div className="card text-left" hidden={props.hidden}>
            <div className="card-header">
                Lịch sử giao dịch
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
                                       dispatch(updateValue(filter));
                                       dispatch(doGetDataThunk());
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
                                       dispatch(updateValue(filter));
                                       dispatch(doGetDataThunk());
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

                                dispatch(updateValue(filter));
                                dispatch(doGetDataThunk());
                            }}
                                    value={history.userAccountFilter.bankSelected}
                            >
                                <option value={""}>Tất cả</option>
                                {history.banks.map((value, index) => {
                                    return <option value={value.name}>{value.name}</option>
                                })}

                            </select>
                        </div>
                    </div>
                    <br/>
                    <div className={"row"}>
                        <div className="col-8">
                            <h3>Tổng cộng: {history.total}</h3>
                        </div>
                    </div>
                    <br/>
                    <div className={"row d-flex justify-content-center"}>
                        <LoadingIndicator isLoading={history.isLoading}/>
                    </div>


                    <br/>
                    <div className={"row d-flex justify-content-center"} hidden={history.totalPage < 2}>
                        <Pagination>
                            <Pagination.First
                                onClick={() => {
                                    dispatch(updateValue({value: 1, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}/>
                            <Pagination.Prev
                                onClick={() => {
                                    dispatch(updateValue({value: history.currentPage - 1, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}/>
                            <Pagination.Ellipsis disabled={true} hidden={history.currentPage == 1}/>

                            <Pagination.Item
                                hidden={history.currentPage == 1}
                                onClick={() => {
                                    dispatch(updateValue({value: history.currentPage - 1, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}
                            >{history.currentPage - 1}</Pagination.Item>
                            <Pagination.Item active>{history.currentPage}</Pagination.Item>
                            <Pagination.Item
                                hidden={history.currentPage >= history.totalPage - 2}
                                onClick={() => {
                                    dispatch(updateValue({value: history.currentPage + 1, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}
                            >{history.currentPage + 1}</Pagination.Item>

                            <Pagination.Ellipsis disabled={true} hidden={history.currentPage >= history.totalPage - 1}/>
                            <Pagination.Item
                                hidden={history.currentPage == history.totalPage}
                                onClick={() => {
                                    dispatch(updateValue({value: history.totalPage, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}
                            >{history.totalPage}</Pagination.Item>
                            <Pagination.Next onClick={() => {
                                dispatch(updateValue({value: history.currentPage + 1, option: ["currentPage"]}))
                                dispatch(doGetDataThunk());
                            }}/>
                            <Pagination.Last onClick={() => {
                                dispatch(updateValue({value: history.totalPage, option: ["currentPage"]}))
                                dispatch(doGetDataThunk());
                            }}/>
                        </Pagination>
                    </div>

                    <Items data={history.dataUserAccount}/>

                    <div className={"row d-flex justify-content-center"} hidden={history.totalPage < 2}>
                        <Pagination>
                            <Pagination.First
                                onClick={() => {
                                    dispatch(updateValue({value: 1, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}/>
                            <Pagination.Prev
                                onClick={() => {
                                    dispatch(updateValue({value: history.currentPage - 1, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}/>
                            <Pagination.Ellipsis disabled={true} hidden={history.currentPage == 1}/>

                            <Pagination.Item
                                hidden={history.currentPage == 1}
                                onClick={() => {
                                    dispatch(updateValue({value: history.currentPage - 1, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}
                            >{history.currentPage - 1}</Pagination.Item>
                            <Pagination.Item active>{history.currentPage}</Pagination.Item>
                            <Pagination.Item
                                hidden={history.currentPage >= history.totalPage - 2}
                                onClick={() => {
                                    dispatch(updateValue({value: history.currentPage + 1, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}
                            >{history.currentPage + 1}</Pagination.Item>

                            <Pagination.Ellipsis disabled={true} hidden={history.currentPage >= history.totalPage - 1}/>
                            <Pagination.Item
                                hidden={history.currentPage == history.totalPage}
                                onClick={() => {
                                    dispatch(updateValue({value: history.totalPage, option: ["currentPage"]}))
                                    dispatch(doGetDataThunk());
                                }}
                            >{history.totalPage}</Pagination.Item>
                            <Pagination.Next onClick={() => {
                                dispatch(updateValue({value: history.currentPage + 1, option: ["currentPage"]}))
                                dispatch(doGetDataThunk());
                            }}/>
                            <Pagination.Last onClick={() => {
                                dispatch(updateValue({value: history.totalPage, option: ["currentPage"]}))
                                dispatch(doGetDataThunk());
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