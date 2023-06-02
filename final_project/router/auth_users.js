const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const bodyParser = require('body-parser');


regd_users.use(bodyParser.json()); // Add this line to parse request bodies as JSON


let users = [];

const isValid = (username) => {
  // Check if the username is valid (already taken)
  let usersWithSameName = users.filter((user) => user.username === username);
  return usersWithSameName.length !== 0;
};



const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validateUsers = users.filter((user) => { return (user.username === username && user.password === password) })
  if (validateUsers.length > 0) {
    return true
  }
  else {
    return false
  }
}

regd_users.post("/login/:username/:password", (req, res) => {
  const username = req.params.username;
  const password = req.params.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  const isbn = parseInt(req.params.isbn)
  const review = req.query.review

  const book = books[isbn]

  if (!book) {
    return res.status(404).json({ message: "Book not found" })
  }

  if (book.reviews[username]) {
    book.reviews[username] = review
    return res.status(200).json({ message: "Review modified successfully" })
  }
  else {
    book.reviews[username] = review
    return res.status(200).json({ message: "Review added successfully" })
  }
});

//delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.session.authorization.username;

  if (books.hasOwnProperty(isbn)) {
    if (books[isbn].reviews.hasOwnProperty(username)) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Book review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Book review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
