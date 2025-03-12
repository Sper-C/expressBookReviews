const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const user = req.body.user;
    const username = user.username;
    const password = user.password;
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password,
        }, "access", { expiresIn: 60 * 60 });
        req.session.authenticated = {
            accessToken, username
        }
        res.status(200).send("User successfully logged in");
    } else res.status(208).json({ "Message": "Invalid login. Check username and password" });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    let filteredBooks = Object.values(books).filter((book) => book.isbn === isbn);
    if (filteredBooks.length > 0) {
        let filteredBook = filteredBooks[0];
        const review = req.params.reviews;
        if (review) {
            filteredBook.reviews = review
        }
        // Replace old book review with updated review
        books = Object.values(books).filter((book) => book.isbn != isbn)
        books.push(filteredBook);
    } else {
        res.send(`Unable to find book with isbn: ${isbn}`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
