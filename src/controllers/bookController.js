const { ReadBook, WriteBook } = require('../models/bookModel');
const { pageInfo } = require('../middleware/validation');

async function listBooks(req, res) {
  try {
    const flashMessage = req.session ? req.session.lastAction : null;
    if (req.session) {
      req.session.lastAction = null;
      req.session.views = (req.session.views || 0) + 1;
    }
    const rawBooks = await ReadBook.find().sort({ createdAt: -1 }).lean();
    const books = rawBooks.map((b) => ({
      ...b,
      formattedPriceBefore: Number(b.priceBeforeTax || 0).toLocaleString('vi-VN') + ' ₫',
      formattedPriceAfter: Number(b.priceAfterTax || 0).toLocaleString('vi-VN') + ' ₫',
    }));
    const totalInventoryValue = rawBooks
      .reduce((sum, b) => sum + (Number(b.priceAfterTax) || 0), 0)
      .toLocaleString('vi-VN') + ' ₫';

    res.render('books', {
      books,
      totalBooks: rawBooks.length,
      totalInventoryValue,
      flashMessage,
      sessionViews: req.session ? req.session.views : 1,
      ...pageInfo(),
    });
  } catch (error) {
    console.error('Lỗi tải danh sách sách:', error);
    res.status(500).render('books', {
      books: [],
      totalBooks: 0,
      totalInventoryValue: '0 ₫',
      error: 'Không thể tải danh sách sách từ Cloud MongoDB.',
      ...pageInfo(),
    });
  }
}

function showAddBook(req, res) {
  res.render('add-book', { ...pageInfo() });
}

async function createBook(req, res) {
  try {
    await WriteBook.create(req.bookData);
    if (req.session) {
      req.session.lastAction = `Đã thêm thành công sách: "${req.bookData.title}" (Mã SP: ${req.bookData.productCode})`;
    }
    res.redirect('/books');
  } catch (error) {
    console.error('Lỗi thêm sách:', error);
    const duplicate = error.code === 11000;
    res.status(400).render('add-book', {
      error: duplicate ? 'Mã sản phẩm đã tồn tại trong cơ sở dữ liệu.' : 'Không thể lưu sách vào Cloud MongoDB.',
      oldData: req.body,
      ...pageInfo(),
    });
  }
}

async function showEditBook(req, res) {
  try {
    const book = await ReadBook.findById(req.params.id).lean();
    if (!book) {
      return res.redirect('/books');
    }
    res.render('edit-book', {
      book,
      oldData: book,
      ...pageInfo(),
    });
  } catch (error) {
    console.error('Lỗi xem chi tiết sách:', error);
    res.redirect('/books');
  }
}

async function updateBook(req, res) {
  try {
    await WriteBook.findByIdAndUpdate(req.params.id, req.bookData);
    if (req.session) {
      req.session.lastAction = `Đã cập nhật thành công sách: "${req.bookData.title}" (Mã SP: ${req.bookData.productCode})`;
    }
    res.redirect('/books');
  } catch (error) {
    console.error('Lỗi cập nhật sách:', error);
    const duplicate = error.code === 11000;
    res.status(400).render('edit-book', {
      error: duplicate ? 'Mã sản phẩm đã bị trùng với sách khác.' : 'Không thể cập nhật thông tin sách.',
      book: { _id: req.params.id, ...req.body },
      oldData: req.body,
      ...pageInfo(),
    });
  }
}

async function deleteBook(req, res) {
  try {
    const deleted = await WriteBook.findByIdAndDelete(req.params.id);
    if (req.session && deleted) {
      req.session.lastAction = `Đã xóa thành công sách: "${deleted.title}" (Mã SP: ${deleted.productCode})`;
    }
    res.redirect('/books');
  } catch (error) {
    console.error('Lỗi xóa sách:', error);
    res.redirect('/books');
  }
}

module.exports = {
  listBooks,
  showAddBook,
  createBook,
  showEditBook,
  updateBook,
  deleteBook,
};
