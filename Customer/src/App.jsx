import React, { Component } from "react";
import "./App.css";
import "./components/Payment";
import Payment from "./components/Payment";

class App extends Component {
	render() {
		return (
			<div>
				<Payment />
			</div>
		);
	}
}

export default App;
