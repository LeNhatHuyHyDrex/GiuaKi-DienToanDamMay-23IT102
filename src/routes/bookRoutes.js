const express = require('express');
const {
  listBooks,
  showAddBook,
  createBook,
  showEditBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { validateBook } = require('../middleware/validation');

const router = express.Router();
router.get('/', (req, res) => res.redirect('/books'));
router.get('/books', listBooks);
router.get('/books/add', showAddBook);
router.post('/books', validateBook, createBook);
router.get('/books/edit/:id', showEditBook);
router.post('/books/edit/:id', validateBook, updateBook);
router.post('/books/delete/:id', deleteBook);

module.exports = router;
