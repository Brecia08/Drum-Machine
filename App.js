import React from "react";
import PropTypes from "prop-types";
class DrumMachine extends React.Component {
  constructor() {
    super();
    this.playAudio = this.playAudio.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.handlePowerClick = this.handlePowerClick.bind(this);
    this.activatePad = this.activatePad.bind(this);
    this.handleVolumeUp = this.handleVolumeUp.bind(this);
    this.handleVolumeDown = this.handleVolumeDown.bind(this);
    this.state = {
      display: "",
      volume: 80,
      power: false,
      kit: [
        { key: "Q", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3", name: "Side-Stick" },
        { key: "W", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3", name: "Snare" },
        { key: "E", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3", name: "Punchy-Kick" },
        { key: "A", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3", name: "Shaker" },
        { key: "S", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3", name: "Clap" },
        { key: "D", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3", name: "Open-HH" },
        { key: "Z", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3", name: "Kick-n'-Hat" },
        { key: "X", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3", name: "Kick" },
        { key: "C", active: false, src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3", name: "Closed-HH" },
      ],
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
  playAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    this.updateDisplay(audio.dataset.name);
  }
  updateDisplay(text) {
    this.setState({ display: text });
  }
  mapKeyCode(code) {
    const keymap = {
      81: "Q",
      87: "W",
      69: "E",
      65: "A",
      83: "S",
      68: "D",
      90: "Z",
      88: "X",
      67: "C",
    };
    return keymap[code];
  }
  
handleKeyUp(e) {
    const x = this.mapKeyCode(e.keyCode);
    this.deactivatePad(x);
  }
  handleKeyDown(e) {
    if (!this.state.power) return;
    const x = this.mapKeyCode(e.keyCode);
    if (!x) return;
    this.activatePad(x);
    const audio = document.getElementById(x);
    if (!audio) return;
    audio.click();
  }
  activatePad(key) {
    this.setState({
      kit: this.state.kit.map((el) => {
        return el.key === key ? { ...el, active: true } : el;
      }),
    });
  }
  deactivatePad(key) {
    this.setState({
      kit: this.state.kit.map((el) => {
        return el.key === key ? { ...el, active: false } : el;
      }),
    });
  }
  handlePowerClick() {
    const text = this.state.power ? "" : "Welcome";
    this.setState((prevState) => ({
      power: !prevState.power,
      display: text,
    }));
  }
  handleVolumeUp() {
    if (this.state.volume < 100) {
      this.setState((prevState) => ({
        volume: prevState.volume + 1,
      }), this.updateVolume);
    }
  }
  handleVolumeDown() {
    if (this.state.volume > 0) {
      this.setState((prevState) => ({
        volume: prevState.volume - 1,
      }), this.updateVolume);
    }
  }
  updateVolume() {
    const audios = document.querySelectorAll("audio");
    audios.forEach((audio) => {
      audio.volume = this.state.volume / 100;
    });
  }
  render() {
    return (
      <div id="drum-machine" className="drum-machine-body">
         <div id="body-top">
          <SoundDisplay text={this.state.display}
            power={this.state.power} />
         <PowerButton buttonClass={'power-button' + (this.props.power ? 'power-button--on' : '')} power={this.state.power} handlePowerClick={this.handlePowerClick}/> 
        </div>
       <div className={'drum-pad-container' + (this.state.power ? ' drum-pad-container--on' : '')}>
            {
              this.state.kit.map(pad =>
                <DrumPad
                  key={pad.key}
                  volume={this.state.volume}
                  pad={pad}
                  play={this.playAudio} />
              )
            }
          </div>
      </div>
    );
  }
}
class DrumPad extends React.Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.handlePadClick = this.handlePadClick.bind(this);
  }
  componentDidMount() {
    this.audioRef.current.volume = this.props.volume / 100;
  }
  handlePadClick() {
    this.props.play(this.audioRef.current);
  }
  render() {
    return (
      <div
        id={this.props.pad.name}
        role="button" tabIndex="-1"
        className={'drum-pad' + (this.props.pad.active ? ' drum-pad--active' : '')}
        onClick={this.handlePadClick}
      >
        <span>{this.props.pad.key}</span>
        <audio
          className="clip"
          src={this.props.pad.src}
          data-name={this.props.pad.name}
          id={this.props.pad.key}
          preload="true"
          ref={this.audioRef}></audio>
      </div>
    );
  }
}

DrumPad.propTypes = {
  volume: PropTypes.number.isRequired,
  pad: PropTypes.object.isRequired,
  play: PropTypes.func.isRequired,
};

class SoundDisplay extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="sound-display" id="display">
        {this.props.text}
      </div>
    );
  }
}
class PowerButton extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
    <button onClick={this.props.handlePowerClick} className="power-button">
        <i className="fa fa-power-off"></i>
      </button>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h2>Beat Machine - freeCodeCamp</h2>
        <DrumMachine />
      </div>
    );
  }
}
export default App