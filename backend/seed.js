const { sequelize, User, Item, Cart } = require('./models');

// Sample data
const items = [
  { name: 'Laptop', price: 999.99 },
  { name: 'Mouse', price: 29.99 },
  { name: 'Keyboard', price: 79.99 },
  { name: 'Monitor', price: 299.99 },
  { name: 'Headphones', price: 149.99 },
  { name: 'USB Cable', price: 9.99 },
  { name: 'Webcam', price: 89.99 },
  { name: 'Desk Lamp', price: 39.99 }
];

const users = [
  { username: 'john', password: 'demo123' },
  { username: 'jane', password: 'demo456' },
  { username: 'bob', password: 'demo789' }
];

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create items
    await Item.bulkCreate(items);
    console.log(`Created ${items.length} items`);

    // Create users
    for (const userData of users) {
      const user = await User.create(userData);
      // Create empty cart for each user
      await Cart.create({ userId: user.id });
    }
    console.log(`Created ${users.length} users with carts`);

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
