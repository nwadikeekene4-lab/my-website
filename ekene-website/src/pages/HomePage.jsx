import { useEffect, useState } from 'react';
import API from '../api'; // Replaced axios with your custom API instance
import { HomePageHeader } from '../header/HomePageHeader';
import './HomePage.css'

export function HomePage({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); 
  const [searchText, setSearchText] = useState('');
  const [highlightId, setHighlightId] = useState(null);

  // --- NEW STATE: Tracks which specific product was just added ---
  const [addedItemId, setAddedItemId] = useState(null);

  useEffect(() => {
    // Points to live backend /products
    API.get('/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: Number(value)
    });
  };

  const handleAddToCart = (product) => {
    if (!product || !product.id) return;
    const quantity = quantities[product.id] || 1;

    API.post('/cart/add', {
      productId: product.id,
      quantity: quantity,
      deliveryOptionId: 'standard'
    })
    .then(() => {
      return API.get('/cart');
    })
    .then((response) => {
      setCart(response.data); 
      setAddedItemId(product.id);
      setTimeout(() => {
        setAddedItemId(null);
      }, 2000);
    })
    .catch(err => {
      console.error("Error adding to cart:", err);
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const normalizedSearch = normalizeText(value);
    const foundProduct = products.find((product) => {
      const normalizedProductName = normalizeText(product.name || "");
      return normalizedProductName.includes(normalizedSearch);
    });

    if (foundProduct) {
      setHighlightId(foundProduct.id);
      const element = document.getElementById(`product-${foundProduct.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const normalizeText = (text) => {
    return (text || "")
      .toLowerCase()
      .replace(/[\s-_]/g, '');
  };

  return (
    <>
      <HomePageHeader cart={cart} onSearch={handleSearch} />

      <div className="home-page">
        <div className="products-grid">
          {products && products.map((product) => {
            // SAFE IMAGE LOGIC:
            let displayImage = `https://placehold.co/300x300?text=${product.name || 'Product'}`;
            
            if (product.image && typeof product.image === 'string' && product.image !== "null") {
              if (product.image.startsWith('http')) {
                displayImage = product.image;
              } else {
                const fileName = product.image.split('/').pop();
                displayImage = `https://res.cloudinary.com/dw4jcixiu/image/upload/f_auto,q_auto/shop_products/${fileName}`;
              }
            }

            return (
              <div
                key={product.id}
                id={`product-${product.id}`}
                className={`product-container ${
                  highlightId === product.id ? 'highlight-product' : ''
                }`}
              >
                <div className="product-image-container">
                  <img 
                    className="product-image" 
                    src={displayImage} 
                    alt={product.name} 
                  />
                </div>

                <div className="product-name">{product.name}</div>

                <div className="product-rating-container">
                  <img 
                    className="product-rating-stars" 
                    src={`images/rating-${(product.rating?.stars || 0) * 10}.png`} 
                    alt="rating"
                  />
                  <div className="product-rating-count">
                    {product.rating?.count || 0}
                  </div>
                </div>

                <div className="product-price">
                  ₦{Number(product.price || 0).toLocaleString()}
                </div>

                <div className="product-quantity-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <select
                    className="selector"
                    value={quantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  >
                    {[...Array(10).keys()].map((n) => (
                      <option key={n + 1} value={n + 1}>{n + 1}</option>
                    ))}
                  </select>

                  {addedItemId === product.id && (
                    <div className="added-checkmark">
                      <span style={{ marginLeft: '10px', color: '#008000', fontWeight: 'bold', fontSize: '14px' }}>
                        ✅ Added
                      </span>
                    </div>
                  )}
                </div>

                <div className="product-spacer"></div>

                <button
                  className="add-to-cart-button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                >
                  Add to cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}