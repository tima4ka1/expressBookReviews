const express = require('express');
const publicUsers = express.Router();
let books = require("./booksdb");
let users = require("./auth_users").users;
let isValid = require("./auth_users").isValid;

publicUsers.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully!" });
});

publicUsers.get("/", (req, res) => {
  res.status(200).json(books);
});

publicUsers.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found." });
  }
});

publicUsers.get("/author/:author", (req, res) => {
  const booksByAuthor = Object.values(books).filter((book) => book.author === req.params.author);

  if (booksByAuthor.length) {
    res.status(200).json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author." });
  }
});

publicUsers.get("/title/:title", (req, res) => {
  const booksByTitle = Object.values(books).filter((book) => book.title === req.params.title);

  if (booksByTitle.length) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title." });
  }
});

publicUsers.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book." });
  }
});

module.exports = { general: publicUsers };
