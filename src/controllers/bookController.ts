import { Request, Response } from "express";
import { getPaginationOptions } from "../utils/pagination";
import BookSchema from "../models/Book";
import mongoose from "mongoose";
import Review from "../models/Review";

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, description, genre, averageRating, userID } =
      req.body;

    const createdBy = new mongoose.Types.ObjectId(userID);

    // Create new book
    const book = await BookSchema.create({
      title,
      author,
      description,
      genre,
      averageRating,
      createdBy,
    });

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { author, genre } = req.query;
    const { page, limit, skip } = getPaginationOptions(req);

    // Build filter

    const filter: any = {};
    if (author) filter.author = { $regex: author, $options: "i" };
    if (genre) filter.genre = { $in: [genre] };

    // Get books with pagination

    const books = await BookSchema.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination

    const total = await BookSchema.countDocuments(filter);

    res.json({
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchBook = async (req: Request, res: Response) => {
  const { title } = req.query;

  if (!title || typeof title !== "string") {
    res.status(400).json({ message: "Title query parameter is required" });
    return;
  }

  try {
    const books = await BookSchema.find({
      title: { $regex: title, $options: "i" },
    });

    res.status(200).json({
      message: "Books retrieved successfully",
      books,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page, limit, skip } = getPaginationOptions(req);

    // Check if ID is valid

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid book ID" });
      return;
    }

    // Find book

    const book = await BookSchema.findById(id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // Get reviews with pagination

    const reviews = await Review.find({ book: id })
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total reviews count for pagination

    const totalReviews = await Review.countDocuments({ book: id });

    // Calculate average rating

    const ratingResult = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating =
      ratingResult.length > 0 ? ratingResult[0].averageRating : 0;

    res.json({
      book,
      averageRating,
      reviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (error) {
    console.error("Get book by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
