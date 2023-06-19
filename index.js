import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
export default App
const rootNode = document.querySelector("#root");
ReactDOM.render(<App displayTextDefault="Drum machine" />, rootNode);
