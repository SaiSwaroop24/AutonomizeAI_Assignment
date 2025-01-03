const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    location: String,
    blog: String,
    bio: String,
    avatar_url: String,
    public_repos: Number,
    public_gists: Number,
    followers: Number,
    following: Number,
    created_at: Date,
    isDeleted: { type: Boolean, default: false },
    friends: [String], // Array of usernames
});

module.exports = mongoose.model('User', userSchema);
