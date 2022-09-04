const App = (props) => {
    let number;

    function generateNumber() {
        number = Math.floor(Math.random() * 100);
        console.log(number);
        return number;
    }

    function speak() {
        const msg = new SpeechSynthesisUtterance();
        msg.text = generateNumber();
        msg.volume = 100;
        msg.rate = 1;
        msg.pitch = 1;
        msg.voice = speechSynthesis.getVoices().filter((v) => v.lang == 'en-US')[0];

        window.speechSynthesis.speak(msg);
    }

    function check(e) {
        if (e.key !== 'Enter')
            return;
        
        console.log(e.target.value == number);
    }

    return (
        <div>
            <button onClick={speak}>Start</button>
            <br></br>
            <input type="number" onKeyDown={check}></input>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
