const API = 'http://localhost:3000/demo/getAcc';

var container = $("#container");
var fl = $("#flash");
class Hello extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello World!</h1>
                <button type="button" onClick={flash}>Flash!</button>
            </div>
        );
    }
}
class Flash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    {items.map(item => (
                        <li>{item.account}</li>
                    ))}
                </ul>
            );
        }
    }
}

ReactDOM.render(<Hello />, container.get(0));

function flash() {
    ReactDOM.render(<Flash />, fl.get(0));
}