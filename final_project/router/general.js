const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4))
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Extract the author parameter from the request URL
    const author = req.params.author.toLowerCase();

    // Convert the 'books' object to an array using Object.values()
    let booksArray = Object.values(books);

    // Use the filter method to find books that match the author
    let filteredBooks = booksArray.filter((book) => book.author.toLowerCase() === author);

    // Check if any books were found by the given author
    if (filteredBooks.length > 0) {
        res.send(filteredBooks);
    } else {
        res.status(404).json({ message: "Author not found" });
    }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Extract the author parameter from the request URL
  const title = req.params.title.toLowerCase();

  // Convert the 'books' object to an array using Object.values()
  let booksArray = Object.values(books);

  // Use the filter method to find books that match the title
  let filteredBooks = booksArray.filter((book) => book.title.toLowerCase() === title);

  // Check if any books were found by the given title
  if (filteredBooks.length > 0) {
      res.send(filteredBooks);
  } else {
      res.status(404).json({ message: "title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
