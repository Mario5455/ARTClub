const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Body parser middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.) from the public directory
app.use(express.static('public'));

// Route for serving the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Route for handling form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate if username and password are provided
  if (!username || !password) {
    res.status(400).send('Username and password are required!');
    return;
  }

  // Check authentication (dummy example, replace with your authentication logic)
  if (username === 'admin' && password === 'password') {
    res.send('Login successful!');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
