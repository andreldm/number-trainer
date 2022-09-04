const App = (props) => {
    return <div>Hello World, {props.foo}</div>;
}

ReactDOM.render(
    <App foo="it works!"/>,
    document.getElementById("root")
);
