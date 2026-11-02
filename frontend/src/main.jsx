import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProivider from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AppContextProivider>
            <App />
        </AppContextProivider>
    </BrowserRouter>
)
