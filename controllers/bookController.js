const Book = require('../models/book'); // Sequelize model for Book
const Review = require('../models/review'); // Sequelize model for Review
const { Op } = require('sequelize'); // Sequelize operator for queries (like iLike, or, etc.)

// Controller to add a new book (Authenticated users only)
exports.addBook = async (req, res) => {
  try {
    // Create a new book using data from request body
    const book = await Book.create(req.body);
    res.status(201).json(book); // Return the created book
  } catch (err) {
    res.status(400).json({ error: err.message }); // Return error if validation fails
  }
};

// Controller to get all books with pagination and optional filters
exports.getBooks = async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;

  const where = {};
  if (author) where.author = { [Op.iLike]: `%${author}%` };
  if (genre) where.genre = { [Op.iLike]: `%${genre}%` };

  const { count, rows } = await Book.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit: parseInt(limit),
    include: {
      model: Review,
      attributes: ['rating', 'comment', 'UserId', 'createdAt'],
    },
    order: [['createdAt', 'DESC']],
  });

  // Add average rating for each book
  const booksWithAvgRating = rows.map(book => {
    const reviews = book.Reviews || [];
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      averageRating: avgRating,
      reviews,
    };
  });

  res.json({
    count,
    books: booksWithAvgRating,
  });
};


// Controller to get book details by ID, including reviews and average rating
exports.getBookById = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { BookId: req.params.id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const avgRating = count
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : null;

    res.json({
      book,
      averageRating: avgRating,
      reviews,
      pagination: {
        totalReviews: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to search books by title or author (case-insensitive, partial match)
exports.searchBooks = async (req, res) => {
  const { byAuthorbyTitle } = req.query;

  // Find books where title or author contains the query string (case-insensitive)
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${byAuthorbyTitle}%` } },
        { author: { [Op.iLike]: `%${byAuthorbyTitle}%` } }
      ]
    }
  });

  res.json(books); // Return matching books
};
