const mongoose = require('mongoose');
const { readConnection, writeConnection } = require('../config/database');

const bookSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  priceBeforeTax: { type: Number, required: true, min: 0 },
  vatRate: { type: Number, required: true },
  priceAfterTax: { type: Number, required: true },
}, { timestamps: true, versionKey: false });

const ReadBook = readConnection.model('Book', bookSchema, 'books');
const WriteBook = writeConnection.model('Book', bookSchema, 'books');

module.exports = { ReadBook, WriteBook };
