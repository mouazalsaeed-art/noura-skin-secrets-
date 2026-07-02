import { Response } from 'express';
import Review from '@/models/Review';
import { AuthRequest } from '@/middleware/auth';

export const getServiceReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({
      serviceId: req.params.serviceId,
      verified: true,
    })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.status(200).json({
      reviews,
      avgRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, rating, comment } = req.body;

    const review = new Review({
      serviceId,
      userId: req.userId,
      clientName: req.body.clientName,
      rating,
      comment,
      verified: false,
    });

    await review.save();

    res.status(201).json({
      message: 'Review created successfully (pending verification)',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

export const verifyReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review verified successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying review', error });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
};
