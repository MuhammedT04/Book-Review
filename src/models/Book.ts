import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  description: string;
  averageRating?: number;
  reviews: mongoose.Types.ObjectId[]; 
  createdBy: mongoose.Types.ObjectId; 
}

const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true },
    description: { type: String },
    averageRating: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBook>('Book', BookSchema);
