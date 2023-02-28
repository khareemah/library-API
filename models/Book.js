const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title of book must be provided'],
  },
  author: {
    type: String,
    required: [true, 'author of book must be provided'],
  },
  genre: {
    type: String,
    required: [true, 'genre of book must be provided'],
    enum: [
      'fiction',
      'philosophy',
      'non-fiction',
      'economics',
      'history',
      'science',
    ],
  },
  publisherName: {
    type: String,
    required: [true, 'publisher name must be provided'],
  },
  publishedDate: {
    type: Number,
    required: [true, 'year of publication must be provided'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  review: {
    type: String,
    minlength: 10,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: [true, 'book price must be provided'],
  },
  isbn: {
    type: Number,
    required: [true, 'isbn must be provided'],
  },
});

module.exports = mongoose.model('Book', BookSchema);
