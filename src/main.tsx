import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' 

// IMPORTANT: Aici se face legătura cu <div id="root"> din HTML
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
