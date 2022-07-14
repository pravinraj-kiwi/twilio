import React from 'react';
import './App.css';
import VideoChat from './VideoChat';


const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Miingl</h1>
      </header>
      <main>
        <div> <VideoChat /></div>
        
      </main>
      <footer>
        <p>
          Made with{' '}
          <span role="img" aria-label="React">
            ⚛️
          </span>{' '}
          by <a href="https://twitter.com/philnash">philnash</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
