import { useEffect, useState } from "react";
import API from "../api"; // Swapped axios for your dynamic API instance
import './AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Changed from axios.get("http://localhost:5000/products")
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  /**
   * DIRECT MAPPER: Logic used for inventory grid display
   */
  const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === "null" || typeof imagePath !== 'string') {
    return "https://placehold.co/100x100?text=No+Image";
  }
  // If it's already a full URL (from Cloudinary), just use it
  if (imagePath.startsWith('http')) return imagePath;
  
  // Fallback for older local images
  const fileName = imagePath.split('/').pop();
  return `https://res.cloudinary.com/dw4jcixiu/image/upload/shop_products/${fileName}`;
};

  const addProduct = async (e) => {
    e.preventDefault();
    if (!newName || !newPrice || !newImageFile) return alert("All fields required");
    
    setIsSaving(true);
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("price", newPrice);
    formData.append("image", newImageFile);

    try {
      // Changed from axios.post("http://localhost:5000/admin/products"...)
      await API.post("/admin/products", formData);
      setNewName("");
      setNewPrice("");
      setNewImageFile(null);
      e.target.reset(); 
      await fetchProducts();
    } catch (err) {
      alert("Error adding product.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      // Changed from axios.delete("http://localhost:5000/admin/products/..."...)
      await API.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Error deleting product.");
    }
  };

  const updateProduct = async (id) => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("price", editPrice);
    if (editImageFile) formData.append("image", editImageFile);

    try {
      // Changed from axios.put("http://localhost:5000/admin/products/..."...)
      await API.put(`/admin/products/${id}`, formData);
      setEditingId(null);
      setEditImageFile(null); 
      await fetchProducts();
    } catch (err) {
      alert("Error updating product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <div className="header-content">
          <h1>Product Management</h1>
          <span className="product-count">{products.length} Items Total</span>
        </div>
      </header>

      <main className="admin-main">
        <section className="form-container">
          <form className="admin-form" onSubmit={addProduct}>
            <h3>Add New Product</h3>
            <div className="form-group-row">
              <input type="text" placeholder="Product Name" value={newName} onChange={(e)=>setNewName(e.target.value)} required />
              <input type="number" placeholder="Price (₦)" value={newPrice} onChange={(e)=>setNewPrice(e.target.value)} required />
              <input type="file" className="file-input" onChange={(e)=>setNewImageFile(e.target.files[0])} required />
              <button type="submit" className="add-btn" disabled={isSaving}>
                {isSaving ? "Uploading..." : "+ Add Product"}
              </button>
            </div>
          </form>
        </section>

        <div className="inventory-grid">
          {products.map((p) => (
            <div key={p.id} className="inventory-card">
              {editingId === p.id ? (
                <div className="edit-overlay">
                  <h3>Editing Product</h3>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                  <input type="file" onChange={(e) => setEditImageFile(e.target.files[0])} />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={() => updateProduct(p.id)}>Save Changes</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="img-wrapper">
                    <img src={getImageUrl(p.image)} alt={p.name} />
                  </div>
                  <div className="info">
                    <p className="p-name">{p.name}</p>
                    <p className="p-price">₦{Number(p.price).toLocaleString()}</p>
                  </div>
                  <div className="actions">
                    <button className="edit-link" onClick={() => { 
                      setEditingId(p.id); 
                      setEditName(p.name); 
                      setEditPrice(p.price); 
                    }}>Edit</button>
                    <button className="delete-link" onClick={() => deleteProduct(p.id)}>Remove</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}