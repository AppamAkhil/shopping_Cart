import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Items({ token, user, onLogout, apiBaseUrl }) {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [notification, setNotification] = useState('');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    loadItems();
    loadCart();
  }, []);

  const loadItems = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/items`);
      setItems(response.data || []);
    } catch (err) {
      console.error('Error loading items:', err);
    }
  };

  const loadCart = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/carts/user`, axiosConfig);
      setCart(response.data);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const addToCart = async (itemId) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/carts`,
        { item_id: itemId },
        axiosConfig
      );
      setCart(response.data);
      showNotification('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification('Error adding item to cart');
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.id) {
      window.alert('Cart is empty');
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/orders`,
        { cart_id: cart.id },
        axiosConfig
      );
      // Clear cart by reloading it
      await loadCart();
      showNotification('Order successful!');
    } catch (err) {
      console.error('Error creating order:', err);
      window.alert('Error placing order');
    }
  };

  const handleShowCart = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/carts/user`, axiosConfig);
      setCart(response.data);
      setShowCartModal(true);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const handleShowOrders = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/orders`, axiosConfig);
      setOrders(response.data || []);
      setShowOrderModal(true);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>E-commerce Store</h1>
        <div className="header-buttons">
          <button className="btn btn-primary" onClick={handleCheckout}>
            Checkout
          </button>
          <button className="btn btn-secondary" onClick={handleShowCart}>
            Cart ({cart?.CartItems?.length || 0})
          </button>
          <button className="btn btn-secondary" onClick={handleShowOrders}>
            Order History
          </button>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <h2>Available Items</h2>
      <div className="items-container">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <div className="item-price">${item.price.toFixed(2)}</div>
            <button
              className="btn btn-primary"
              onClick={() => addToCart(item.id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {notification && (
        <div className="toast">{notification}</div>
      )}

      {showCartModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowCartModal(false)} />
          <div className="cart-modal">
            <button
              className="modal-close-btn"
              onClick={() => setShowCartModal(false)}
            >
              ×
            </button>
            <h2>Shopping Cart</h2>
            {cart?.CartItems && cart.CartItems.length > 0 ? (
              <>
                {cart.CartItems.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <p><strong>Item ID:</strong> {item.itemId}</p>
                    <p><strong>Item Name:</strong> {item.Item?.name || 'Unknown'}</p>
                    <p><strong>Price:</strong> ${item.Item?.price?.toFixed(2) || 'N/A'}</p>
                  </div>
                ))}
              </>
            ) : (
              <p>No items in cart</p>
            )}
            <button
              className="btn btn-primary"
              onClick={() => {
                window.alert(
                  cart?.CartItems && cart.CartItems.length > 0
                    ? `Cart ID: ${cart.id}\nItems: ${cart.CartItems.map(i => `Item ${i.itemId}`).join(', ')}`
                    : 'Cart is empty'
                );
              }}
            >
              View Cart Details
            </button>
          </div>
        </>
      )}

      {showOrderModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowOrderModal(false)} />
          <div className="order-modal">
            <button
              className="modal-close-btn"
              onClick={() => setShowOrderModal(false)}
            >
              ×
            </button>
            <h2>Order History</h2>
            {orders && orders.length > 0 ? (
              <>
                {orders.map((order, idx) => (
                  <div key={idx} className="order-item">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p>
                      <strong>Items:</strong>{' '}
                      {order.OrderItems && order.OrderItems.length > 0
                        ? order.OrderItems.map(i => `Item ${i.itemId}`).join(', ')
                        : 'No items'}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <p>No orders placed yet</p>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => {
                const orderIds = orders.map(o => `Order ${o.id}`).join(', ');
                window.alert(orderIds || 'No orders placed yet');
              }}
            >
              View All Order IDs
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Items;
