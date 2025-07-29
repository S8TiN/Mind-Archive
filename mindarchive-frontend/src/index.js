// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import RootApp from './RootApp';
import { ThemeProvider } from './ThemeContext'; 

import './App.css';
import './index.css';

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
