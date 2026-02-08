const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
  User, 
  Item, 
  Cart, 
  CartItem, 
  Order, 
  OrderItem 
} = require('./models');
const { authMiddleware } = require('./middleware');

const router = express.Router();

// ============ USER ENDPOINTS ============

// POST /users - Sign up new user
router.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.create({
      username,
      password
    });

    // Generate token
    user.generateToken();
    await user.save();

    // Create empty cart for user
    await Cart.create({ userId: user.id });

    res.status(201).json({
      id: user.id,
      username: user.username,
      token: user.token
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

// POST /users/login - Login user
router.post('/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate new token (invalidates previous)
    user.generateToken();
    await user.save();

    // Load user's cart
    const cart = await Cart.findOne({ where: { userId: user.id } });

    res.json({
      token: user.token,
      user: {
        id: user.id,
        username: user.username,
        token: user.token,
        cart
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /users - List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ ITEM ENDPOINTS ============

// POST /items - Create an item
router.post('/items', async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
    }

    const item = await Item.create({ name, price });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /items - List all items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ CART ENDPOINTS ============

// POST /carts - Add item to cart (protected)
router.post('/carts', authMiddleware, async (req, res) => {
  try {
    const { item_id } = req.body;

    if (!item_id) {
      return res.status(400).json({ error: 'Item ID required' });
    }

    // Get user's cart
    let cart = await Cart.findOne({ where: { userId: req.userId } });
    if (!cart) {
      cart = await Cart.create({ userId: req.userId });
    }

    // Add item to cart
    const cartItem = await CartItem.create({
      cartId: cart.id,
      itemId: item_id
    });

    // Load cart with items
    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: CartItem,
          include: [Item]
        }
      ]
    });

    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /carts - List all carts (protected)
router.get('/carts', authMiddleware, async (req, res) => {
  try {
    const carts = await Cart.findAll({
      include: [
        {
          model: CartItem,
          include: [Item]
        }
      ]
    });
    res.json(carts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /carts/user - Get user's cart (protected)
router.get('/carts/user', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.userId },
      include: [
        {
          model: CartItem,
          include: [Item]
        }
      ]
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ ORDER ENDPOINTS ============

// POST /orders - Create order from cart (protected)
router.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { cart_id } = req.body;

    if (!cart_id) {
      return res.status(400).json({ error: 'Cart ID required' });
    }

    // Get cart and verify ownership
    const cart = await Cart.findOne({
      where: { id: cart_id, userId: req.userId },
      include: [
        {
          model: CartItem,
          include: [Item]
        }
      ]
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Create order
    const order = await Order.create({ userId: req.userId });

    // Copy cart items to order items
    for (const cartItem of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        itemId: cartItem.itemId
      });
    }

    // Delete cart items
    await CartItem.destroy({ where: { cartId: cart.id } });

    // Load order with items
    const updatedOrder = await Order.findOne({
      where: { id: order.id },
      include: [
        {
          model: OrderItem,
          include: [Item]
        }
      ]
    });

    res.status(201).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /orders - List user's orders (protected)
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: OrderItem,
          include: [Item]
        }
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
