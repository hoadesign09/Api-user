const express = require('express');
const app = express();
const PORT = 3131;

app.use(express.json());

let users = [];

app.post('/users', (req, res) => {
  const { email } = req.body;
  const newUser = { email, savedShows: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
