const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Tarefa 6: Registrar novo usuário
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Tarefa 1: Obter lista de livros disponíveis
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Tarefa 2: Obter livros baseado no ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Tarefa 3: Obter livros por autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filtered_books = {};
  
  for (let key in books) {
    if (books[key].author === author) {
      filtered_books[key] = books[key];
    }
  }
  res.send(filtered_books);
});

// Tarefa 4: Obter livros por título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filtered_books = {};
  
  for (let key in books) {
    if (books[key].title === title) {
      filtered_books[key] = books[key];
    }
  }
  res.send(filtered_books);
});

// Tarefa 5: Obter resenha do livro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Tarefa 10: Obter todos os livros usando async callback
function getAllBooks(callback) {
  setTimeout(() => {
    callback(null, books);
  }, 1000);
}

public_users.get('/async/books', function (req, res) {
  getAllBooks((err, books) => {
    if (err) {
      res.status(500).json({message: "Error retrieving books"});
    } else {
      res.json(books);
    }
  });
});

// Tarefa 11: Pesquisar por ISBN usando Promises
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 1000);
  })
  .then(book => res.json(book))
  .catch(error => res.status(404).json({message: error}));
});

// Tarefa 12: Pesquisar por autor usando async/await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        let filtered_books = {};
        for (let key in books) {
          if (books[key].author === author) {
            filtered_books[key] = books[key];
          }
        }
        resolve(filtered_books);
      }, 1000);
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({message: "Error searching by author"});
  }
});

// Tarefa 13: Pesquisar por título usando async/await
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        let filtered_books = {};
        for (let key in books) {
          if (books[key].title === title) {
            filtered_books[key] = books[key];
          }
        }
        resolve(filtered_books);
      }, 1000);
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({message: "Error searching by title"});
  }
});

module.exports.general = public_users;
