const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Add axios


public_users.post("/register", (req,res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists in the users array
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
  }

  // If username does not, create a new user and add to the users array
  users.push({ "username" : username, "password": password });

  // Return success message
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        const response = await axios.get('http://localhost:3000/books'); // Assuming  books API is running here
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params; // Get ISBN from request parameters
    try {
        // Make a request to fetch the book details by ISBN
        const response = await axios.get(`http://localhost:3000/books/isbn/${isbn}`); // Update this URL as needed
        res.json(response.data); // Send the book details as a JSON response
    } catch (error) {
        res.status(404).json({ message: "Book not found", error: error.message }); // Return error if book is not found
    }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author.toLowerCase(); // Get author from request parameters
    try {
        // Make a request to fetch the book details by author
        const response = await axios.get('http://localhost:3000/books'); // Update this URL to your books endpoint
        const booksArray = response.data; // Assuming response contains the books array

        // Filter the books to find those that match the author
        const filteredBooks = booksArray.filter((book) => book.author.toLowerCase() === author);

        // Check if any books were found by the given author
        if (filteredBooks.length > 0) {
            res.json(filteredBooks); // Send filtered books as JSON response
        } else {
            res.status(404).json({ message: "Author not found" }); // No books found for that author
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message }); // Handle errors
    }
  
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title.toLowerCase(); // Get title from request parameters
    try {
        // Make a request to fetch the book details by title
        const response = await axios.get('http://localhost:3000/books'); // Update this URL to your books endpoint
        const booksArray = response.data; // Assuming response contains the books array

        // Filter the books to find those that match the title
        const filteredBooks = booksArray.filter((book) => book.title.toLowerCase() === title);

        // Check if any books were found by the given title
        if (filteredBooks.length > 0) {
            res.json(filteredBooks); // Send filtered books as JSON response
        } else {
            res.status(404).json({ message: "Title not found" }); // No books found with that title
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message }); // Handle errors
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Extract the ISBN parameter from the request URL
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
      // Get the reviews of the book
      const bookReviews = books[isbn].reviews;

      // Return the reviews
      res.send(bookReviews);
  } else {
      // If the book with the given ISBN doesn't exist, return a 404 error
      res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
