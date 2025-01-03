const express = require('express');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

// 1. Save GitHub user data
router.post('/save-user', async (req, res) => {
    const { username } = req.body;
    try {
        let user = await User.findOne({ username });

        if (!user) {
            const response = await axios.get(`https://api.github.com/users/${username}`);
            const userData = response.data;

            user = new User({
                username: userData.login,
                location: userData.location,
                blog: userData.blog,
                bio: userData.bio,
                avatar_url: userData.avatar_url,
                public_repos: userData.public_repos,
                public_gists: userData.public_gists,
                followers: userData.followers,
                following: userData.following,
                created_at: userData.created_at,
            });
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch GitHub data.' });
    }
});

// 2. Find mutual friends
router.post('/mutual-friends', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const response = await axios.get(`https://api.github.com/users/${username}/following`);
        const following = response.data.map((f) => f.login);

        const mutualFriends = [];
        for (const friend of following) {
            const isMutual = await User.findOne({ username: friend, following: username });
            if (isMutual) mutualFriends.push(friend);
        }

        user.friends = mutualFriends;
        await user.save();
        res.json(mutualFriends);
    } catch (error) {
        res.status(500).json({ error: 'Failed to find mutual friends.' });
    }
});

// 3. Search user data
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const users = await User.find({
            $or: [
                { username: new RegExp(query, 'i') },
                { location: new RegExp(query, 'i') },
            ],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// 4. Soft delete user
router.delete('/delete-user/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOneAndUpdate(
            { username },
            { isDeleted: true },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// 5. Update user data
router.put('/update-user/:username', async (req, res) => {
    const { username } = req.params;
    const updates = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { username },
            { $set: updates },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// 6. Get sorted user list
router.get('/list', async (req, res) => {
    const { sortField = 'username' } = req.query;
    try {
        const users = await User.find().sort({ [sortField]: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
