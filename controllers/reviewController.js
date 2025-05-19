const Review = require('../models/review'); // Sequelize model for the Review table

// Controller to add a review to a specific book
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.id;       // Book ID from URL parameter
  const userId = req.user.id;         // Authenticated user's ID from JWT middleware

  // Create and save the new review
  const review = await Review.create({
    rating,
    comment,
    BookId: bookId,
    UserId: userId
  });

  res.status(201).json(review); // Return the newly created review
};

// Controller to update a review
exports.updateReview = async (req, res) => {
  // Find review by its ID
  const review = await Review.findByPk(req.params.id);

  // Only the user who created the review can update it
  if (!review || review.UserId !== req.user.id)
    return res.status(403).json({ error: 'Unauthorized' });

  const { rating, comment } = req.body;

  // Update review fields
  review.rating = rating;
  review.comment = comment;

  await review.save(); // Save changes to the database

  res.json(review); // Return updated review
};

// Controller to delete a review
exports.deleteReview = async (req, res) => {
  // Find review by its ID
  const review = await Review.findByPk(req.params.id);

  // Only the user who created the review can delete it
  if (!review || review.UserId !== req.user.id)
    return res.status(403).json({ error: 'Unauthorized' });

  await review.destroy(); // Delete the review from the database

  res.json({ message: 'Review deleted' }); // Confirm deletion
};
