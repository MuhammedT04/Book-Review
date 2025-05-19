import express from "express";
import {validate} from "../middleware/validation";
import {bookSchema} from '../validation/bookSchema'
import {createBook, getBookById, getBooks, searchBook} from '../controllers/bookController'
import { createReview } from "../controllers/reviewController";
import { reviewSchema } from "../validation/reviewSchema";
const bookRouder = express.Router();

bookRouder.post("/", validate(bookSchema),createBook );

bookRouder.get('/', getBooks)

bookRouder.get('/search', searchBook)

bookRouder.get('/:id', getBookById);

bookRouder.post("/:id/reviews", validate(reviewSchema), createReview);


export default bookRouder;