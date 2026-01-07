import { useEffect, useState } from "react";
import API from "../api"; // Replaced axios with your custom API instance
import './AdminOrders.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    // Changed from axios.get("http://localhost:5000/orders")
    API.get("/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  };

  /**
   * DIRECT MAPPER: Handles both full URLs and raw filenames
   */
  const getImageUrl = (item) => {
    const path = item?.image || item?.product?.image || item?.productImage;
    
    if (!path || path === "null" || typeof path !== 'string' || path.includes("[object")) {
      return "https://placehold.co/100x100?text=No+Image";
    }

    // If it's already a full link, use it
    if (path.startsWith('http')) return path;

    // If it's just a filename, build the Cloudinary link manually
    return `https://res.cloudinary.com/dw4jcixiu/image/upload/shop_products/${path}`;
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure?")) {
      try {
        // Changed to use API.delete
        await API.delete(`/orders/${orderId}`);
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (err) { alert("Error deleting order."); }
    }
  };

  const clearAllOrders = async () => {
    if (window.confirm("WARNING: Delete ALL orders?")) {
      try {
        // Changed to use API.delete
        await API.delete("/orders");
        setOrders([]);
      } catch (err) { alert("Error clearing orders."); }
    }
  };

  const handleCopy = (text, e) => {
    navigator.clipboard.writeText(text);
    const btn = e.target;
    const originalText = btn.innerText;
    btn.innerText = "Copied!";
    setTimeout(() => { btn.innerText = originalText; }, 1500);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Changed to use API.patch
      await API.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) { alert("Error updating status"); }
  };

  return (
    <div className="admin-orders-page">
      <h2 className="page-title">Customer Orders</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">No orders found.</div>
        ) : (
          orders.map(order => {
            const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
            
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="header-left">
                    <span className="order-ref">Ref: {order.reference}</span>
                    <select 
                      className={`status-select ${(order.status || "pending").toLowerCase()}`}
                      value={order.status || "Pending"}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <span className="order-amount">₦{Number(order.amount).toLocaleString()}</span>
                </div>

                <div className="order-content">
                  <div className="info-section shipping-info">
                    <h4>Shipping</h4>
                    <p><strong>{order.customerName}</strong></p>
                    <p>{order.address} <button className="copy-btn" onClick={(e) => handleCopy(order.address, e)}>Copy</button></p>
                    <p>{order.phone} <button className="copy-btn" onClick={(e) => handleCopy(order.phone, e)}>Copy</button></p>
                  </div>

                  <div className="info-section items-info">
                    <h4>Items ({orderItems.length})</h4>
                    <div className="items-grid">
                      {orderItems.map((item, index) => (
                        <div key={index} className="item-row">
                          <img 
                            src={getImageUrl(item)} 
                            alt="Product" 
                            className="item-thumb" 
                          />
                          <div className="item-text">
                            <p className="item-name">{item.name || item.product?.name || "Product Item"}</p>
                            <p className="item-meta">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="single-delete-btn" onClick={() => deleteOrder(order.id)}>Delete Record</button>
              </div>
            );
          })
        )}
        {orders.length > 0 && (
          <button className="clear-all-btn" onClick={clearAllOrders}>Delete All Orders Permanently</button>
        )}
      </div>
    </div>
  );
}