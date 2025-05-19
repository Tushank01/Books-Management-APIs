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
  if (author) where.author = { [Op.iLike]: `%${author}%` }; // Case-insensitive author filter
  if (genre) where.genre = { [Op.iLike]: `%${genre}%` };   // Case-insensitive genre filter

  // Fetch paginated and filtered books
  const books = await Book.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit: parseInt(limit)
  });

  res.json(books); // Return the list of books
};

// Controller to get book details by ID, including reviews and average rating
exports.getBookById = async (req, res) => {
  try {
    // Find book by primary key (ID), and include related reviews
    const book = await Book.findByPk(req.params.id, {
      include: {
        model: Review,
        limit: 10,     // Limit reviews to 10
        offset: 0,     // Offset for pagination (could be enhanced later)
      },
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });

    const reviews = book.Reviews || [];

    // Calculate average rating if reviews exist
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

    // Return structured book details, excluding nested duplicate "Reviews" key
    res.json({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      averageRating: avgRating,
      reviews, 
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
