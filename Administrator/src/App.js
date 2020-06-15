import React from 'react';

import './App.css';
import {Menu} from "./features/Menu/Menu";
import {Login} from "./features/Login/Login";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <Switch>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/home">
                                <Menu />
                            </Route>
                        </Switch>
                    </div>
                </Router>

            </div>
        );
    }
}




export default App;
