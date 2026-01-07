import { Routes, Route } from 'react-router';
import { useState, useEffect } from 'react'; 
import API from './api'; // Replaced axios with your custom API instance
import { HomePage } from './pages/HomePage';
import { Checkout } from './pages/checkout';
import { OrderPage } from './pages/orderpage';
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import { AdminLogin } from "./admin/AdminLogin";
import { ProtectedRoute } from './ProtectedRoute';

function App () {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Points to https://ekene-backend-shop.onrender.com/cart
    API.get('/cart')
      .then((response) => {
        setCart(response.data);
      })
      .catch(err => console.error("Initial cart fetch error:", err));
  }, []);
    
  return (
    <Routes> 
        {/* Public Routes */}
        <Route path="/" element={<HomePage cart={cart} setCart={setCart} />}/>
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />}/>
        <Route path="/orderpage" element={<OrderPage cart={cart} setCart={setCart} />}/>
        
        {/* Public Login Page */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/products" element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        } />

        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } />
    </Routes>
  );
}

export default App;