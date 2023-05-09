const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3132;

// parse application/json
app.use(bodyParser.json());

// connect to database
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true });

// create user schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  fullname: [String],
  phone: [String],
  savedShows: [String],
});

// create user model
const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (err) {
      console.error('Error getting users', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// create new user
app.post('/users', async (req, res) => {
  const { email, savedShows } = req.body;
  const user = new User({ email, savedShows });

  try {
    await user.save();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
