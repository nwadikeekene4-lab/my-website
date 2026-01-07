import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import API from '../api'; // Replaced axios with your custom API instance
import './checkout.css';

export function Checkout({ cart = [], setCart }) {
  // Dynamic dates starting from today
  const deliveryOptions = [
    dayjs().add(3, 'day').format("dddd, MMMM D"),
    dayjs().add(5, 'day').format("dddd, MMMM D"),
    dayjs().add(7, 'day').format("dddd, MMMM D")
  ];

  const [selectedDate, setSelectedDate] = useState("");
  const isVerifying = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // UPDATED: Added 'email' to state
  const [customerDetails, setCustomerDetails] = useState({
    name: '', 
    email: '', 
    address: '', 
    city: '', 
    country: 'Nigeria', 
    phone: ''
  });

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/100x100?text=No+Image";
    return img; 
  };

  const handleInputChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handleChange = (event) => { 
    setSelectedDate(event.target.value); 
  };

  const handleDelete = (cartItemId) => {
    // Points to live backend /cart/:id
    API.delete(`/cart/${cartItemId}`)
      .then(() => API.get('/cart'))
      .then((response) => setCart(response.data))
      .catch(err => console.error(err));
  };

  const handleClearCart = () => {
    if (window.confirm("Remove all items?")) {
      // Points to live backend /cart/clear
      API.delete('/cart/clear')
        .then(() => setCart([]))
        .catch(err => console.error(err));
    }
  };

  let itemsTotal = 0;
  let shippingTotal = 0;
  
  cart.forEach(item => {
    itemsTotal += (item.product?.price || 0) * (item.quantity || 0);
    shippingTotal += selectedDate ? (item.deliveryOption?.price || 500) : 0; 
  });

  const taxRate = 0.10;
  const totalBeforeTax = itemsTotal + shippingTotal;
  const estimatedTax = totalBeforeTax * taxRate;
  const orderTotal = totalBeforeTax + estimatedTax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("You cannot place an empty order");
    if (!selectedDate) return alert("Please select a delivery date first."); 
    
    if (!customerDetails.name || !customerDetails.email || !customerDetails.address || !customerDetails.phone) {
      return alert("Please fill in all shipping details, including your email.");
    }

    setIsProcessing(true);
    const detailsToSave = { ...customerDetails, selectedDate: selectedDate };

    try {
      // Points to live backend /paystack/init
      const response = await API.post("/paystack/init", {
        email: customerDetails.email, 
        amount: orderTotal,
        customerDetails: detailsToSave 
      });

      if (response.data.status && response.data.data.authorization_url) {
        localStorage.setItem("pendingCustomerDetails", JSON.stringify(detailsToSave));
        window.location.href = response.data.data.authorization_url;
      }
    } catch (err) {
      alert("Payment failed to initialize.");
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (reference) => {
    if (isVerifying.current) return;
    isVerifying.current = true;
    const savedDetails = JSON.parse(localStorage.getItem("pendingCustomerDetails"));

    try {
      // Points to live backend /payment/verify
      const response = await API.post("/payment/verify", { 
        reference,
        customerDetails: savedDetails 
      });
      if (response.data.success) {
        localStorage.removeItem("pendingCustomerDetails");
        setCart([]); 
        window.location.href = "/orderpage"; 
      }
    } catch (err) {
      console.error(err);
    } finally {
      isVerifying.current = false;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (reference) verifyPayment(reference);
  }, []);

  return (
    <div className="checkout-main-wrapper">
      <div className="checkout-header">
        <div className="header-content">
          <div className="website-name">Ekene Website</div>
          <div className="quantity-indicator">Checkout ({cart.length} items)</div>
          <div className="link-container"><Link to="/" className="home-link">Home</Link></div>
        </div>
      </div>

      <div className="checkout-container">
        <div className="ordersummarypayment-container">
          <div className="order-summary">
            <div className="shipping-form-container">
              <h3 className="form-title">Shipping Information</h3>
              <div className="shipping-grid">
                <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} className="checkout-input" required />
                <input type="email" name="email" placeholder="Email Address (for receipt)" onChange={handleInputChange} className="checkout-input" required />
                <input type="text" name="address" placeholder="Delivery Address" onChange={handleInputChange} className="checkout-input" required />
                <div className="city-country-row">
                  <input type="text" name="city" placeholder="City" onChange={handleInputChange} className="checkout-input" />
                  <input type="text" name="country" value={customerDetails.country} readOnly className="checkout-input" />
                </div>
                <input type="text" name="phone" placeholder="Phone Number" onChange={handleInputChange} className="checkout-input" required />
              </div>
            </div>

            <div className="review-order-org">
              <strong className="review-order">Review your order</strong>
              {cart.length > 0 && (
                <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
              )}
            </div>

            {cart.map(cartItem => (
              <div key={cartItem.id} className="delivery-date-card">
                <div className="delivery-header">Delivery Estimate: <span className="highlight-date">{selectedDate || "Not selected"}</span></div>
                <div className="img-itemdeliverycontainer">
                  <div className="image-container">
                    <img className="product-checkout-image" src={getImageUrl(cartItem.product?.image)} alt={cartItem.product?.name} />
                  </div>

                  <div className="item-details">
                    <div className="product-checkout-name"><strong>{cartItem.product?.name}</strong></div>
                    <div className="product-checkout-price">₦{Number(cartItem.product?.price).toLocaleString()}</div>
                    <div className="product-checkout-quantity">Quantity: {cartItem.quantity}</div>
                    <button className="delete-item-btn" onClick={() => handleDelete(cartItem.id)}>Delete</button>
                  </div>

                  <div className="delivery-options-section">
                    <strong>Choose delivery date:</strong>
                    <div className="options-list">
                      {deliveryOptions.map(date => (
                        <label key={date} className="delivery-option-label">
                          <input
                            type="radio"
                            name={`deliveryDate-${cartItem.id}`} 
                            value={date}
                            checked={selectedDate === date}
                            onChange={handleChange}
                          />
                          <span>{date}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="payment-summary">
            <div className="payment-name"><strong>Payment Summary</strong></div>
            <div className="payment-row">
              <span>Items ({cart.length}):</span>
              <span>₦{itemsTotal.toLocaleString()}</span>
            </div>
            <div className="payment-row">
              <span>Shipping:</span>
              <span>₦{shippingTotal.toLocaleString()}</span>
            </div>
            <div className="payment-row">
              <span>Total before tax:</span>
              <span>₦{totalBeforeTax.toLocaleString()}</span>
            </div>
            <div className="payment-row tax-row">
              <span>Estimated tax (10%):</span>
              <span>₦{estimatedTax.toLocaleString()}</span>
            </div>
            <div className="order-total-section">
              <div className="order-total-row">
                <strong>Order Total:</strong>
                <strong className="total-amount">₦{orderTotal.toLocaleString()}</strong>
              </div>
              <button className="placeorder-button" onClick={handlePlaceOrder} disabled={isProcessing || cart.length === 0}>
                {isProcessing ? "Processing..." : "Place your order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}