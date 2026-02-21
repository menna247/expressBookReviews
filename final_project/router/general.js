const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      const exists = users.filter((user) => user.username === username);
      
      if (exists.length === 0) {
        users.push({ "username": username, "password": password });
        return res.status(201).json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(400).json({ message: "User already exists!" });
      }
    }
    
    return res.status(400).json({ message: "Unable to register user: Missing username or password" });
  });

// Get the book list available in the shop
//public_users.get('/', function (req, res) {
 //   res.send(JSON.stringify(books, null, 4));
 // });
// Task 10
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks.then((bookList) => {
        res.status(200).send(JSON.stringify(bookList, null, 4));
    }).catch((error) => {
        res.status(500).json({ message: "Error retrieving books" });
    });
});
// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
//    const isbn = req.params.isbn; 
//    const book = books[isbn];    
  
//    if (book) {
//      return res.status(200).send(JSON.stringify(book, null, 4));
//    } else {
//      return res.status(404).json({message: "Book not found"});
//    }
//  });
// Task 11
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const getBook = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ status: 404, message: "Book not found" });
        }
    });

    getBook
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});  
// Get book details based on author
//public_users.get('/author/:author', function (req, res) {
//    const author = req.params.author;
//    const keys = Object.keys(books); 
//    const filtered_books = [];
//    keys.forEach((key) => {
//      if (books[key].author === author) {
//        filtered_books.push(books[key]);
//      }
//    });
  
//    if (filtered_books.length > 0) {
//      res.send(JSON.stringify(filtered_books, null, 4));
//    } else {
//      res.status(404).json({ message: "No books found for this author" });
//    }
 // });
// Task 12
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const getBooksByAuthor = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const filteredBooks = keys
            .filter(key => books[key].author === author)
            .map(key => books[key]);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ status: 404, message: "No books found for this author" });
        }
    });

    getBooksByAuthor
        .then((books) => res.status(200).send(JSON.stringify(books, null, 4)))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});
// Get all books based on title
//public_users.get('/title/:title', function (req, res) {
//    const title = req.params.title;
//    const keys = Object.keys(books); // Obtain all keys from booksdb.js
 //   const filtered_books = [];
  
 //   keys.forEach((key) => {
//      if (books[key].title === title) {
 //       filtered_books.push(books[key]);
 //     }
 //   });
  
//    if (filtered_books.length > 0) {
 //     res.send(JSON.stringify(filtered_books, null, 4));
 //   } else {
//      res.status(404).json({ message: "No books found with this title" });
 //   }
//  });
// Task 13:
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const filteredBooks = keys
            .filter(key => books[key].title === title)
            .map(key => books[key]);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ status: 404, message: "No books found with this title" });
        }
    });

    getBooksByTitle
        .then((books) => res.status(200).send(JSON.stringify(books, null, 4)))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});
// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; 
    const book = books[isbn];  
  
    if (book) {
      res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
