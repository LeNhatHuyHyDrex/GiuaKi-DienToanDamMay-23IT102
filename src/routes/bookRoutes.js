const express = require('express');
const { listBooks, showAddBook, createBook } = require('../controllers/bookController');
const { validateBook } = require('../middleware/validation');

const router = express.Router();
router.get('/', (req, res) => res.redirect('/books'));
router.get('/books', listBooks);
router.get('/books/add', showAddBook);
router.post('/books', validateBook, createBook);

module.exports = router;
