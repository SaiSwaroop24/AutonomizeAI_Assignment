const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors());
mongoose.connect('mongodb+srv://swaroop:21pa1a1277@cluster0.646q6h1.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    details: Object,
    friends: [String],
    isDeleted: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

// Route to save user data from GitHub API
app.post('/api/users', async (req, res) => {
    const { username } = req.body;

    try {
        let user = await User.findOne({ username, isDeleted: false });

        if (!user) {
            const response = await axios.get(`https://api.github.com/users/${username}`);
            user = new User({
                username,
                details: response.data,
                friends: [],
            });
            await user.save();
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to find mutual followers
app.get('/api/users/:username/friends', async (req, res) => {
  const { username } = req.params;

  try {
      const response = await axios.get(`https://api.github.com/users/${username}/following`);
      const following = response.data.map((user) => user.login);
      const response2 = await axios.get(`https://api.github.com/users/${username}/followers`);
      const followers = response2.data.map((user) => user.login);

      // Find mutual friends (users who are both following and followed by the user)
      const mutuals = following.filter((user) => followers.includes(user));
      const user = await User.findOneAndUpdate(
          { username },
          { $set: { friends: mutuals } },
          { new: true }  // Return the updated user object
      );
      console.log(mutuals);
      res.json(mutuals);  
  } catch (error) {
      res.status(500).json({ error: error.message });  
  }
});


// Search users based on fields
app.get('/api/users/search', async (req, res) => {
    const { username, location } = req.query;

    try {
        const query = { isDeleted: false };
        if (username) query['details.login'] = username;
        if (location) query['details.location'] = location;
        console.log(query);

        const users = await User.find(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Soft delete user
app.delete('/api/users/:username', async (req, res) => {
    const { username } = req.params;

    try {
        await User.findOneAndUpdate({ username }, { $set: { isDeleted: true } });
        res.json({ message: 'User soft-deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user details
app.put('/api/users/:username', async (req, res) => {
    const { username } = req.params;
    const updates = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { username },
            { $set: { 'details': { ...updates } } },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users sorted by a field
app.get('/api/users', async (req, res) => {
    const { sortBy } = req.query;

    try {
        const users = await User.find({ isDeleted: false }).sort({ [`details.${sortBy}`]: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
