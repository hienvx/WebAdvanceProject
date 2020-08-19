import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-loader-spinner";
import Pagination from "react-bootstrap/Pagination";
import { Button, Modal, Form, Input, Radio, Select } from "antd";
import "antd/dist/antd.css";
import {
  doGetListReceiverThunk,
  listAccountsModel,
  updateValue,
} from "./ListReceiverSlice";
import axios from "axios";

const { Option } = Select;

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

export function ListReceiver(props) {
  const dispatch = useDispatch();
  const listAccounts = useSelector(listAccountsModel);
  let timer;
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [ModalText, setModalText] = useState("Tạo tài khoản tiết kiệm ");
  const [typeSaving, setTypeSaving] = useState(1);
  const [amount, setAmount] = useState(0);
  const [typeReceiving, setTypeReceiving] = useState(1);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    axios
      .post(
        "http://localhost:3000/customers/addSavingAccount",
        {
          numberAccount: parseInt(
            listAccounts.dataUserDetail.paymentAccount.numberAccount
          ),
          typeSaving: typeSaving,
          amount: amount,
          typeReceiving: typeReceiving,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken_Employee_KAT"),
          },
        }
      )
      .then((result) => {
        console.log(result.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  if (listAccounts.isStart) {
    dispatch(doGetListReceiverThunk());
  }

  return (
    <div>
      <Modal
        title="Tạo tài khoản tiết kiệm"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item
            name="typeSaving"
            label="Chọn kỳ hạn gửi"
            hasFeedback
            rules={[{ required: true, message: "Làm ơn chọn kỳ hạn gửi!" }]}
          >
            <Select
              placeholder="Chọn kỳ hạn gửi"
              onChange={(value) => {
                setTypeSaving(parseInt(value));
              }}
            >
              <Option value="1">14 ngày - 0.2%/năm</Option>
              <Option value="2">1 tháng - 3.7%/năm</Option>
              <Option value="3">6 tháng: 4.4%/năm</Option>
              <Option value="4">12 tháng: 6.0%/năm</Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Số tiền gửi">
            <Input
              type="textarea"
              onChange={(event) => {
                setAmount(parseInt(event.target.value));
              }}
            />
          </Form.Item>
          <Form.Item
            name="typeReceving"
            label="Chọn hình thức trả lãi"
            hasFeedback
            rules={[
              { required: true, message: "Làm ơn chọn hình thức trả lãi!" },
            ]}
            onChange={(value) => {
              setTypeReceiving(parseInt(value));
            }}
          >
            <Select placeholder="Chọn hình thức trả lãi">
              <Option value="1">Lãi nhập gốc</Option>
              <Option value="2">
                Lãi trả vào tài khoản tiền gửi khi đến hạn trả lãi
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <div>
        <h3>Tài khoản thanh toán</h3>
        <div>
          <h5>
            Số tài khoản:{" "}
            <p style={{ fontWeight: "bold" }}>
              {listAccounts.dataUserDetail.paymentAccount.numberAccount || ""}{" "}
            </p>
          </h5>
          <h5>
            Số dư:{" "}
            <p style={{ fontWeight: "bold" }}>
              {listAccounts.dataUserDetail.paymentAccount.currentBalance || ""}{" "}
              VND
            </p>
          </h5>
        </div>
      </div>

      {/* Saving Accounts */}
      <div className="card text-left" hidden={props.hidden}>
        <div className="card-header"> </div>
        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ alignSelf: "right" }}
              onClick={showModal}
            >
              <span>Mở tài khoản tiết kiệm</span>
            </button>
          </div>
          <form action="#">
            <div className={"row"}>
              <div className="col-8">
                <h3>
                  Số lượng tài khoản tiết kiệm:{" "}
                  {listAccounts.dataUserSavingAccounts.length || 0}
                </h3>
              </div>
            </div>

            <div className={"row d-flex justify-content-center"}>
              <LoadingIndicator isLoading={listAccounts.isLoading} />
            </div>

            <Items data={listAccounts.dataUserSavingAccounts} />

            {listAccounts.dataUserSavingAccounts ? (
              <div className={"row d-flex justify-content-center"}>
                <Pagination hidden={true}>
                  <Pagination.First
                    onClick={() => {
                      dispatch(
                        updateValue({ value: 1, option: ["currentPage"] })
                      );
                      dispatch(doGetListReceiverThunk());
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
                      dispatch(doGetListReceiverThunk());
                    }}
                  />
                  <Pagination.Ellipsis disabled={true} hidden={true} />

                  <Pagination.Item
                    hidden={true}
                    onClick={() => {
                      dispatch(
                        updateValue({
                          value: listAccounts.currentPage - 1,
                          option: ["currentPage"],
                        })
                      );
                      dispatch(doGetListReceiverThunk());
                    }}
                  >
                    {listAccounts.currentPage - 1}
                  </Pagination.Item>
                  <Pagination.Item active>
                    {listAccounts.currentPage}
                  </Pagination.Item>
                  <Pagination.Item
                    hidden={true}
                    onClick={() => {
                      dispatch(
                        updateValue({
                          value: listAccounts.currentPage + 1,
                          option: ["currentPage"],
                        })
                      );
                      dispatch(doGetListReceiverThunk());
                    }}
                  >
                    {listAccounts.currentPage + 1}
                  </Pagination.Item>

                  <Pagination.Ellipsis disabled={true} hidden={true} />
                  <Pagination.Item
                    hidden={true}
                    onClick={() => {
                      dispatch(
                        updateValue({
                          value: listAccounts.totalPage,
                          option: ["currentPage"],
                        })
                      );
                      dispatch(doGetListReceiverThunk());
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
                      dispatch(doGetListReceiverThunk());
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
                      dispatch(doGetListReceiverThunk());
                    }}
                  />
                </Pagination>
              </div>
            ) : null}
          </form>
        </div>
        <div className="card-footer text-muted"></div>
      </div>
    </div>
  );
}
