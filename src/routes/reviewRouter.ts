import express from "express";
import {validate} from "../middleware/validation";
import {reviewSchema} from '../validation/reviewSchema'
import { deleteReview, updateReview } from "../controllers/reviewController";

const ReviewRouder = express.Router();

ReviewRouder.put("/:id", validate(reviewSchema), updateReview);
ReviewRouder.delete("/:id", deleteReview);

export default ReviewRouder;