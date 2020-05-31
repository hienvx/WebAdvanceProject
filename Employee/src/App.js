import React from 'react';
import './App.css';
import {Recharge} from "./features/Recharge/Recharge";
/*import {CreateCustomerAccount} from "./features/FormCreateCustomerAccount/CustomerAccount";*/


function App() {
    return (
        <div className="App">
           {/* <CreateCustomerAccount/>*/}
            <Recharge/>
        </div>
    );
}

export default App;
