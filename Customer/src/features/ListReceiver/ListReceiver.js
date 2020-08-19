import React, { useState, useEffect } from "react";
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
      <td>{props.data.name}</td>
      <td>
        <Button
          onClick={() => {
            props.handleDelete(props.stt - 1);
          }}
          key={props.stt}
        >
          Xóa
        </Button>
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
          <th scope="col">Số tài khoản</th>
          <th scope="col">Tên gợi nhớ</th>
          <th scope="col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {data.map((value, index) => {
          return (
            <RowItem
              stt={index + 1}
              data={value}
              key={index + 1}
              handleDelete={props.handleDelete}
            />
          );
        })}
      </tbody>
    </table>
  );
}

export function ListReceiver(props) {
  const dispatch = useDispatch();
  const listAccounts = useSelector(listAccountsModel);
  const [myNumberAccount, setMyNumberAccount] = useState("");
  const [numberAccount, setNumberAccount] = useState("");
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  const handleDelete = async (index) => {
    console.log("handleDelete -> index", index);
    setData(data.slice(index + 1));
    await axios
      .post("http://localhost:3000/customers/deletecontact", {
        myNumberAccount: myNumberAccount,
        numberAccount: data[index].numberAccount,
        name: name,
      })
      .then((result) => {
        console.log("ListReceiver -> result", result.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/customers/getUserDetail", {
        headers: {
          "x-access-token": localStorage.getItem("accessToken_Employee_KAT"),
        },
      })
      .then((result) => {
        result.data.contactList
          ? setData(result.data.contactList)
          : console.log("khong co contact");
        setMyNumberAccount(result.data.paymentAccount.numberAccount);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div>
      <Form.Item name="numberAccount" label="Số tài khoản">
        <Input
          type="textarea"
          onChange={(event) => {
            setNumberAccount(event.target.value);
          }}
        />
      </Form.Item>
      <Form.Item name="numberAccount" label="Tên gợi nhớ">
        <Input
          type="textarea"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </Form.Item>
      <Button
        onClick={async () => {
          setData([...data, { numberAccount: numberAccount, name: name }]);
          await axios
            .post("http://localhost:3000/customers/addcontact", {
              myNumberAccount: myNumberAccount,
              numberAccount: numberAccount,
              name: name,
            })
            .then((result) => {
              console.log("ListReceiver -> result", result.data);
            })
            .catch((e) => {
              console.log(e);
            });
        }}
      >
        Thêm
      </Button>
      <Items data={data} handleDelete={handleDelete} />
    </div>
  );
}
