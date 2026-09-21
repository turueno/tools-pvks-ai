import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SuiteDictionaryProvider } from './context/SuiteDictionaryContext.jsx'
import { AccessGuardProvider } from './context/AccessGuardContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccessGuardProvider>
      <SuiteDictionaryProvider>
        <App />
      </SuiteDictionaryProvider>
    </AccessGuardProvider>
  </StrictMode>,
)
