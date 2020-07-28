import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-loader-spinner";
import Pagination from "react-bootstrap/Pagination";
import {
  doGetListAccountsThunk,
  listAccountsModel,
  updateValue,
} from "./ListAccountsSlice";

function RowItem(props) {
  return (
    <tr>
      <th scope="row">{props.stt}</th>
      <td>{props.data.numberAccount}</td>
      <td>{props.data.currentBalance}</td>
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
          <th scope="col">Số tài khoản</th>
          <th scope="col">Số dư hiện tại</th>
        </tr>
      </thead>
      <tbody>
        {console.log(data)}
        {data
          ? data.map((value, index) => {
              return <RowItem stt={index + 1} data={value} key={index + 1} />;
            })
          : null}
      </tbody>
    </table>
  );
}
export const LoadingIndicator = (props) => {
  return (
    props.isLoading && (
      <div>
        <Loader type="ThreeDots" color="#f8b739" height="100" width="100" />
      </div>
    )
  );
};

export function ListAccounts(props) {
  const dispatch = useDispatch();
  const listAccounts = useSelector(listAccountsModel);
  let timer;

  if (listAccounts.isStart) {
    dispatch(doGetListAccountsThunk());
  }

  return (
    <div className="card text-left" hidden={props.hidden}>
      <div className="card-header"> </div>
      <div className="card-body">
        <form action="#">
          <div className={"row"}>
            <div className="col-8">
              <h3>
                Số lượng tài khoản tiết kiệm: {listAccounts.totalData || 0}
              </h3>
            </div>
          </div>

          <div className={"row d-flex justify-content-center"}>
            <LoadingIndicator isLoading={listAccounts.isLoading} />
          </div>

          <Items data={listAccounts.dataUserAccount} />

          {listAccounts.dataUserAccount ? (
            <div className={"row d-flex justify-content-center"}>
              <Pagination hidden={listAccounts.totalPage < 2}>
                <Pagination.First
                  onClick={() => {
                    dispatch(
                      updateValue({ value: 1, option: ["currentPage"] })
                    );
                    dispatch(doGetListAccountsThunk());
                  }}
                />
                <Pagination.Prev
                  onClick={() => {
                    dispatch(
                      updateValue({
                        value: listAccounts.currentPage - 1,
                        option: ["currentPage"],
                      })
                    );
                    dispatch(doGetListAccountsThunk());
                  }}
                />
                <Pagination.Ellipsis
                  disabled={true}
                  hidden={listAccounts.currentPage <= 2}
                />

                <Pagination.Item
                  hidden={listAccounts.currentPage <= 1}
                  onClick={() => {
                    dispatch(
                      updateValue({
                        value: listAccounts.currentPage - 1,
                        option: ["currentPage"],
                      })
                    );
                    dispatch(doGetListAccountsThunk());
                  }}
                >
                  {listAccounts.currentPage - 1}
                </Pagination.Item>
                <Pagination.Item active>
                  {listAccounts.currentPage}
                </Pagination.Item>
                <Pagination.Item
                  hidden={
                    listAccounts.currentPage >= listAccounts.totalPage - 2
                  }
                  onClick={() => {
                    dispatch(
                      updateValue({
                        value: listAccounts.currentPage + 1,
                        option: ["currentPage"],
                      })
                    );
                    dispatch(doGetListAccountsThunk());
                  }}
                >
                  {listAccounts.currentPage + 1}
                </Pagination.Item>

                <Pagination.Ellipsis
                  disabled={true}
                  hidden={
                    listAccounts.currentPage >= listAccounts.totalPage - 1
                  }
                />
                <Pagination.Item
                  hidden={listAccounts.currentPage === listAccounts.totalPage}
                  onClick={() => {
                    dispatch(
                      updateValue({
                        value: listAccounts.totalPage,
                        option: ["currentPage"],
                      })
                    );
                    dispatch(doGetListAccountsThunk());
                  }}
                >
                  {listAccounts.totalPage}
                </Pagination.Item>
                <Pagination.Next
                  onClick={() => {
                    dispatch(
                      updateValue({
                        value: listAccounts.currentPage + 1,
                        option: ["currentPage"],
                      })
                    );
                    dispatch(doGetListAccountsThunk());
                  }}
                />
                <Pagination.Last
                  onClick={() => {
                    dispatch(
                      updateValue({
                        value: listAccounts.totalPage,
                        option: ["currentPage"],
                      })
                    );
                    dispatch(doGetListAccountsThunk());
                  }}
                />
              </Pagination>
            </div>
          ) : null}
        </form>
      </div>
      <div className="card-footer text-muted"></div>
    </div>
  );
}
