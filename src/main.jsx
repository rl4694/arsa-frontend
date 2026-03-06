/*
 * This file renders the React App into a root DOM node
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './Auth/AuthProvider/AuthProvider'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <StrictMode>
          <AuthProvider>
              <App />
          </AuthProvider>
      </StrictMode>
  </BrowserRouter>
)
