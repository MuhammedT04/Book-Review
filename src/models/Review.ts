import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;     
  rating: number;                  
  comment: string;
}

const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
