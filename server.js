const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3132;

app.use(bodyParser.json());
app.use(cors())
mongoose.connect('mongodb://localhost/User', { useNewUrlParser: true });

// const validateUserInput = (req, res, next) => {
//   const { fullname, phone, services } = req.body;

//   if (!fullname || !phone || !services) {
//     return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin người dùng.' });
//   }

//   next();
// }

const userSchema = new mongoose.Schema({
  _id: {type: String},
  uid: {type: String, default: null},
  email: { type: String, unique: true, required: true },
  password: {type: String, default: null},
  fullname: {type: String, default: null},
  phone: {type: String, default: null},
  services: {type: String, default: null}, 
  savedShows: [String], 
});

userSchema.pre('save', function(next) {
  this._id = this.uid;
  next();
});

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
  
app.post('/users',async (req, res) => {
  const { uid, email, password, savedShows, fullname, phone, services } = req.body;
  const user = new User({ uid, email, password, savedShows, fullname, phone, services });

  try {
    await user.save();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send('User not found');
    }
    res.send(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.patch('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(req.params.id , req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
