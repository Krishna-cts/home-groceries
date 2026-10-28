

// ==========================================
// #index.js
// ==========================================
import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import App from './App'; 
import { Amplify } from 'aws-amplify'; 
import awsConfig from './awsConfig'; 

Amplify.configure(awsConfig); 
console.log("Amplify configured", awsConfig);

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);