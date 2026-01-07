import { useEffect, useState } from "react";
import API from "../api"; // Replaced axios with your dynamic API instance
import { HomePageHeader } from "../header/HomePageHeader";
import "./orderpage.css";

export function OrderPage () {
  const [orders, setOrders] = useState([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    // Points to https://ekene-backend-shop.onrender.com/orders
    API.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * DIRECT MAPPER: Handles both full URLs and raw filenames
   */
  const getImageUrl = (item) => {
    const path = item?.image || item?.product?.image || item?.productImage;
    
    if (!path || path === "null" || typeof path !== 'string' || path.includes("[object")) {
      return "https://placehold.co/100x100?text=No+Image";
    }

    if (path.startsWith('http')) return path;

    return `https://res.cloudinary.com/dw4jcixiu/image/upload/shop_products/${path}`;
  };

  return(
    <>
      <HomePageHeader cart={[]} />
      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="no-orders"><p>No orders yet</p></div>
        ) : (
          orders.map((order) => {
            const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);

            return (
              <div key={order.id} className="order-wrapper">
                <div className="Order-header">
                  <div className="order-placed"><strong>Placed: {new Date(order.createdAt).toDateString()}</strong></div>
                  <div className="total"><strong>Total: ₦{order.amount}</strong></div>
                  <div className="order-id"><strong>ID: {order.reference}</strong></div>
                </div>

                <div className="order-listing">
                  {orderItems.map((item, index) => (
                    <div key={index} className="product1-container">
                      <div className="image1-container"> 
                        <img
                          className="product1-image"
                          src={getImageUrl(item)}
                          alt="Product"
                        />
                      </div> 
                      <div className="product1-details">
                        <p className="RSG">{item.name || item.product?.name || "Product"}</p>
                        <p className="arrival-date">Arriving: {item.deliveryOption?.deliveryDays || "Pending"}</p>
                        <p className="quantity">Quantity: {item.quantity}</p>
                        <p className="product-price-order">₦{item.price || item.product?.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
      {showScrollBtn && <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>}
    </>
  );
}