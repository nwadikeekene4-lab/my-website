import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Added useEffect
import './homepageheader.css';

export function HomePageHeader({ cart = [], onSearch }) {
  // Safely calculate totalQuantity
  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  const [inputText, setInputText] = useState('');
  const [isBouncing, setIsBouncing] = useState(false); // New state for animation

  // --- TRIGGER BOUNCE EFFECT ---
  useEffect(() => {
    if (totalQuantity > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 400); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]); // Runs every time quantity changes

  const handleButtonClick = () => {
    if (onSearch) onSearch(inputText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="homepageheader-container">
      <div className="left-section">
        <Link to="/" className="header-link">
          Home
        </Link>
      </div>

      <div className="middle-section">
        <input 
          className="input" 
          type="text" 
          placeholder="Search Product" 
          value={inputText} 
          onChange={(e) => setInputText(e.currentTarget.value)} 
          onKeyPress={handleKeyPress} 
        />
        <button className="enter" onClick={handleButtonClick}>
          <img className="search-icon" src="images/search-icon.png" alt="search" />
        </button>
      </div>

      <div className="right-section">
        <Link to="/orderpage" className="headerorder-link">
          <span className="orders-text">Orders</span>
        </Link>

        <Link to="/checkout" className="headercart-link">
          <div className="cart-container">
            <img className="cart-icon" src="images/cart-image.png" alt="cart" />
            {/* Added conditional bounce class */}
            <div className={`item-quantity ${isBouncing ? 'cart-bounce' : ''}`}>
              {totalQuantity}
            </div>
          </div>
          <div className="cart-text"> Cart </div>
        </Link>
      </div>
    </div>
  );
}