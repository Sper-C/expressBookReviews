const express = require('express');
let books = require("./booksdb.js");
const { authenticated } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.query.username;
    let password = req.query.password;
    if (!username || !password) {
        res.status(404).json({"Message": "Missing username or password"});
    }
    if (isValid(username)) {
        users.push({username, password});
        res.send("The user "+ username + " has been added!")
    } else {
        res.send("The user " + username + " already exists");
    }
    
    // if (authenticated(username, password)) {
    //     // Generate JWT access token
    //     let accessToken = jwt.sign({
    //         data: password,
    //     }, "access", {expiresIn: 60*60});
    //     req.session.authenticated = {
    //         accessToken, username
    //     }
    //     res.status(200).send("User successfully logged in");
    // } else res.status(208).json({"Message": "Invalid login. Check username and password"});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    //Write your code here
    res.send(books);
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = Number(req.params.isbn);
  let filteredBooks = Object.values(books).filter((book) => book.isbn === isbn);
  if (filteredBooks.length > 0) {
    res.send(filteredBooks);
  } else {
    res.json({message: `Cannot find the book with isbn: ${isbn}`});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filteredBooks = Object.values(books).filter((book) => book.author === author);
  if (filteredBooks.length > 0) {
    res.send(filteredBooks);
  } else {
    res.json({message: `Cannot find the book with author: ${author}`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
  let filteredBooks = Object.values(books).filter((book) => book.title === title);
  if (filteredBooks.length > 0) {
    res.send(filteredBooks);
  } else {
    res.json({message: `Cannot find the book with title: ${title}`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = Number(req.params.isbn);
  let filteredBooks = Object.values(books).filter((book) => book.isbn === isbn);
  if (filteredBooks.length > 0) {
    res.send(filteredBooks[0]['reviews']);
  } else {
    res.json({message: `Cannot find the book with isbn: ${isbn}`});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
