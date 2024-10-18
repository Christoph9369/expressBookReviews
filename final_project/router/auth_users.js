const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

//Check if user with given name and password exists
const authenticatedUser = (username,password)=>{ 
    //Filter the users array for any user with the same username and password
    let validUser = users.filter((user) => {
        return (user.username === username && user.password === password) 
    });
    //Return True if any valid user is found, otherwise false
    if (validUser.length > 0) {
        return true; 
    } else {return false}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username ,password} = req.body; 

  //check if username or password are missing
  if (!username || !password){
    return res.status(404).json({message: "Error login in"})
  }
  //Authenticate user
  if (authenticatedUser(username,password)){
    //generatevJWT ACCES TOKEN 
    let accessToken = jwt.sign({username: username},'access', {expiresIn: 60 * 60})

    //store store access token and username in session
    req.session.authorization = {accessToken, username}
   return res.status(200).send("user successfully logged in")
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"})
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from request
    const username = req.session.authorization.username; // Get the username from session

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    let book = books[isbn]; // Get the book object
    let reviews = book.reviews; // Get the book's reviews

    // Check if the user has a review for this book
    if (reviews[username]) {
        // Delete the user's review
        delete reviews[username];

        // Respond with success message
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        // If the user doesn't have a review for this book
        return res.status(404).json({ message: "Review not found for the user" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from request params
    const review = req.query.review; // Extract the review from request query
    const username = req.session.authorization.username; // Get the username from session

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Get the reviews object for the book
    let book = books[isbn];
    
    // If no reviews exist for this book, initialize the reviews object
    if (!book.reviews) {
        book.reviews = {};
    }

    // Add or update the user's review for the book
    book.reviews[username] = review;

    // Return a success message
    return res.status(200).json({
        message: "Review successfully added/updated",
        reviews: book.reviews
    });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
