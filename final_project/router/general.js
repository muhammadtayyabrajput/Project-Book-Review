const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bodyParser = require('body-parser');


public_users.use(bodyParser.json()); // Add this line to parse request bodies as JSON



public_users.post("/register/:username/:password", (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  console.log(req.params); // Debugging the request body
  console.log(username, password); // Debugging the values

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  } else {
    return res.status(400).json({ message: "Unable to register user. Invalid username or password" });
  }
});






// Get the book list available in the shop
public_users.get('/', (req, res) => {
  //Write your code here
  return new Promise((resolve, reject) => {
    const bookList = Object.values(books)
    return res.status(200).json(bookList)
  }).then(() => {
    // Optional success callback
    console.log("Book found successfully");
  })
    .catch((error) => {
      // Optional error callback
      console.log("Error finding book:", error);
    });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = parseInt(req.params.isbn);

  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(res.status(200).json(book));
    } else {
      reject(res.status(404).json({ message: "Book not found" }));
    }
  })
    .then(() => {
      // Optional success callback
      console.log("Book found successfully");
    })
    .catch((error) => {
      // Optional error callback
      console.log("Error finding book:", error);
    });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author

  return new Promise((resolve, reject) => {
    const bookDetails = Object.values(books).filter((book) => book.author === author)
    if (bookDetails.length > 0) {
      res.status(200).json(bookDetails)
    }
    else {
      return res.status(404).json({ message: "book not found" });
    }
  }).then(() => {
    // Optional success callback
    console.log("Book found successfully");
  })
    .catch((error) => {
      // Optional error callback
      console.log("Error finding book:", error);
    });

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title

  return new Promise((resolve, reject) => {
    const bookDetails = Object.values(books).filter((book) => book.title === title)
    if (bookDetails.length > 0) {
      res.status(200).json(bookDetails)
    }
    else {
      return res.status(404).json({ message: "book not found" });
    }
  }).then(() => {
    // Optional success callback
    console.log("Book found successfully");
  })
    .catch((error) => {
      // Optional error callback
      console.log("Error finding book:", error);
    });

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];

  if (book) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
