import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

//don't forget to hide this in an .env file or somewhere in a real app! (and restrict the key in the google cloud console to only be valid on our domain, etc etc - security best practices)
//want to use environment variables like v support- whatever that is
const CLIENT_ID = "533738969001-3b55i33lkhl8adh3ofl4aicitq310eaq.apps.googleusercontent.com"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
