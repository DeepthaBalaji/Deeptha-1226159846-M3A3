const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3800;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Dummy user database (for demonstration purposes)
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

// User session tracking (for demonstration purposes)
const userSessions = new Set();

// Global Middleware for Logging Request Details
app.use((req, res, next) => {
  const currentDate = new Date().toLocaleString();
  console.log(`[${currentDate}] ${req.method} ${req.url}`);
  next();
});

// Authentication Middleware
function isAuthenticated(req, res, next) {
  if (true) {
    next(); // User is authenticated; proceed to the next middleware or route handler.
  } else {
    res.status(401).send('Unauthorized'); // Respond with a 401 Unauthorized status.
  }
}

// Session Middleware
app.use((req, res, next) => {
  if (!req.sessionID) {
    req.sessionID = Math.random().toString(36).slice(2); // Generate a random session ID (for demonstration purposes).
  }
  next();
});

// Route to Display Login Form
app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  `);
});

// Route to Handle Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    userSessions.add(req.sessionID); // Mark the user as authenticated.
    res.send('Login successful. <a href="/add-to-cart">Add a book to the cart</a>');
  } else {
    res.status(401).send('Login failed. <a href="/login">Try again</a>');
  }
});

// Route to Display Cart
app.get('/cart', isAuthenticated, (req, res) => {
  // For demonstration purposes, we're using an array to store cart items.
  const cartItems = req.session.cart || [];
  res.send(`
    <h1>Shopping Cart</h1>
    <ul>
      ${cartItems.map((item) => `<li>${item}</li>`).join('')}
    </ul>
    <a href="/add-to-cart">Add a book to the cart</a>
    <a href="/remove-from-cart">Remove a book from the cart</a>
    <a href="/logout">Logout</a>
  `);
});

// Route to Add a Book to the Cart
app.get('/add-to-cart', isAuthenticated, (req, res) => {
  // For demonstration purposes, we're using an array to store cart items.
  req.session.cart = req.session.cart || [];
  req.session.cart.push('Book'); // Add a book to the cart.
  res.redirect('/cart');
});

// Route to Remove a Book from the Cart
app.get('/remove-from-cart', isAuthenticated, (req, res) => {
  // For demonstration purposes, we're using an array to store cart items.
  req.session.cart = req.session.cart || [];
  req.session.cart.pop(); // Remove a book from the cart.
  res.redirect('/cart');
});

// Route to Logout
app.get('/logout', (req, res) => {
  userSessions.delete(req.sessionID); // Mark the user as logged out.
  res.send('Logout successful. <a href="/login">Login again</a>');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
