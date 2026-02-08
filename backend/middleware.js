const { User } = require('./models');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    // Handle both "Bearer TOKEN" and just "TOKEN"
    let token = authHeader.replace('Bearer ', '').trim();
    
    const user = await User.findOne({ where: { token } });

    if (!user) {
      console.error('Token not found in database:', token);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { authMiddleware };
