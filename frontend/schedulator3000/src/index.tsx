import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const backup = console.error;
console.error = function filter(msg) {
    const supressedWarnings = ['Warning: Using UNSAFE_component','Warning: %s is deprecated in StrictMode'];

    if (!supressedWarnings.some(entry => msg.includes(entry))) {
        backup.apply(console, [msg]);
    }
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
