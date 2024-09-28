import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import DayEnd from './pages/DayEnd';
import DayReport from './pages/DayReport';
import Login1 from './pages/Login1';
import { AuthProvider } from "./AuthContext";  // Corrected import
import PurchaseReport from './pages/PurchaseReport';
import ProductSummary from './pages/ProductSummary';
import DayEndReport2 from './pages/DayEndReport2';
import MonthEndReport from './pages/MonthEndReport';

function App() {
  return (
    <div className="App">
      <AuthProvider>  {/* Use AuthProvider instead of AuthDataProvider */}
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login1 />} />
            <Route path='/home' element={<Home />} />
            {/* <Route path='/dayend' element={<DayEnd />} /> */}
            <Route path='/dayreport' element={<DayReport />} />
            <Route path='/purchase' element={<PurchaseReport/>} />
            <Route path='/productsummary' element={<ProductSummary/>} />
            <Route path='/dayendreport' element={<DayEndReport2/>} />
            <Route path='/monthendreport' element={<MonthEndReport/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
