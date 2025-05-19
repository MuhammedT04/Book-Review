  import mongoose, { Document, Schema } from "mongoose";

  interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
  }

  const userSchema: Schema<IUser> = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  const UserSchema = mongoose.model<IUser>("User", userSchema);

  export default UserSchema;
