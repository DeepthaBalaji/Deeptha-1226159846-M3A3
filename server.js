const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

class UserDataMiddleware {
  constructor() {
    this.loggedInUsers = new Set();
    this.validCredentials = {
      user1: 'password1',
      user2: 'password2',
    };
  }

  authenticate(username, password) {
    if (this.validCredentials[username] === password) {
      this.loggedInUsers.add(username);
      return true;
    }
    return false;
  }

  isAuthenticated(username) {
    return this.loggedInUsers.has(username);
  }

  logActivity(username, activity) {
    if (this.isAuthenticated(username)) {
      console.log(`User '${username}' performed '${activity}'`);
    } else {
      console.log(`Unauthorized access attempt for user '${username}'`);
    }
  }
}

const userDataMiddleware = new UserDataMiddleware();

// Authentication route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (userDataMiddleware.authenticate(username, password)) {
    res.status(200).json({ message: 'Authentication successful' });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

// Activity logging route
app.post('/log-activity', (req, res) => {
  const { username, activity } = req.body;
  userDataMiddleware.logActivity(username, activity);
  res.status(200).json({ message: 'Activity logged successfully' });
});

// Default route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the User Data Middleware API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
