// src/index.js
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RootApp from './RootApp';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider> 
        <RootApp />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
