import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import Trade from './pages/Trade.jsx'
import { TradeProvider } from './trade/TradeContext.jsx'
import { ProductsProvider } from './trade/ProductsProvider.jsx'

export default function App() {
  return (
    <ProductsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="/trade"
            element={
              <TradeProvider>
                <Trade />
              </TradeProvider>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProductsProvider>
  )
}
