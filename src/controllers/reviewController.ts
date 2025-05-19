import { Request, Response } from "express";
import BookSchema from "../models/Book";
import Review from "../models/Review";
import mongoose from "mongoose";

export const createReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, userID } = req.body;
    const createdBy = new mongoose.Types.ObjectId(userID);

    // Check if book exists

    const book = await BookSchema.findById(id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // Check if user has already reviewed this book

    const existingReview = await Review.findOne({
      book: id,
      user: createdBy,
    });

    if (existingReview) {
      res.status(400).json({ message: "You have already reviewed this book" });
      return;
    }

    // Create new review

    const review = await Review.create({
      book: id,
      user: createdBy,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, userID } = req.body;
    // Check if review exists
    console.log(req.body, "popopopop");
    const review = await Review.findOne({
      book: id,
    });
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    // Update review

    const updateData = await Review.findOneAndUpdate(
      { book: id, _id: review._id },
      { $set: { rating, comment } },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Review updated successfully",
      updateData,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if review exists

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }
    //delete review

    await Review.findByIdAndDelete(id);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
