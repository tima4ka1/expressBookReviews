const express = require('express');
const jwt = require('jsonwebtoken');
const regdUsers = express.Router();
let books = require("./booksdb");
let users = [];

const isValid = (username) => users.some((user) => user.username === username);

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username && user.password === password);
  return Boolean(user);
};

regdUsers.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "access", { expiresIn: '1h' });
    req.session.token = token;

    return res.status(200).json({ message: "Login successful", token });
  }

  return res.status(401).json({ message: "Invalid username or password" });
});

regdUsers.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;
  return res.status(200).json({ message: "Review added or updated successfully." });
});

regdUsers.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  const book = books[isbn];
  if (!book || !book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found." });
  }

  delete book.reviews[username];
  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports = { authenticated: regdUsers, isValid, users };
