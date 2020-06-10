import React from 'react';
import './App.css';
/*import {Recharge} from "./features/Recharge/Recharge";*/
import {History} from "./features/History/History";
import {Menu} from "./features/Menu/Menu";

/*import {CreateCustomerAccount} from "./features/FormCreateCustomerAccount/CustomerAccount";*/


function App() {
    return (
        <div className="App">
            {/* <CreateCustomerAccount/>*/}
            {/*<Recharge/>*/}
            {/* <History/>*/}
            <Menu/>
        </div>
    );
}

export default App;
