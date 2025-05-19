import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Checkout from './pages/client/checkout';
import PaymentResult from './pages/client/payment_result';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <>
              <div>
                <a href="https://vite.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
              </div>
              <h1>Book Store</h1>
              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </button>
                <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
                </p>
              </div>
              <p className="read-the-docs">
                Click on the Vite and React logos to learn more
              </p>
            </>
          } />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
