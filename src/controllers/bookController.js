const { ReadBook, WriteBook } = require('../models/bookModel');
const { pageInfo } = require('../middleware/validation');

async function listBooks(req, res) {
  try {
    const books = await ReadBook.find().sort({ createdAt: -1 }).lean();
    res.render('books', { books, ...pageInfo() });
  } catch (error) {
    console.error(error);
    res.status(500).render('books', { books: [], error: 'Khong the tai danh sach sach.', ...pageInfo() });
  }
}

function showAddBook(req, res) {
  res.render('add-book', { ...pageInfo() });
}

async function createBook(req, res) {
  try {
    await WriteBook.create(req.bookData);
    req.session.lastAction = `Da them sach ${req.bookData.title}`;
    res.redirect('/books');
  } catch (error) {
    console.error(error);
    const duplicate = error.code === 11000;
    res.status(400).render('add-book', {
      error: duplicate ? 'Ma san pham da ton tai.' : 'Khong the them sach.',
      oldData: req.body,
      ...pageInfo(),
    });
  }
}

module.exports = { listBooks, showAddBook, createBook };
