import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './mainPage'
import DepositSearch from './depositSearch'
import DepositCalculator from './depositCalculator';
import Navbar from './navBar';
import './App.css'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/deposit-search" element={<DepositSearch />} />
        <Route path="/deposit-calculator" element={<DepositCalculator />} />
      </Routes>
    </Router>
  )
}

export default App
