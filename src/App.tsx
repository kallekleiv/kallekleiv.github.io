import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Torjus Kalleiv</h1>
        <p>Welcome to my personal website!</p>
        <p>Built with React, TypeScript, esbuild, and Biome.</p>
        <a
          className="App-link"
          href="https://github.com/kallekleiv"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit my GitHub
        </a>
      </header>
    </div>
  );
}

export default App;
