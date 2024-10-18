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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
