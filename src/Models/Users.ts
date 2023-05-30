import { Document, model, Schema } from "mongoose";
const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fullname: { type: String },
        age: { type: Number }
    },
    {
        timestamps: true,
    }
);

export interface IUser extends Document {
    email: string;
    password: string
    fullname: string;
    age: number
}

export default model<IUser>("users", userSchema);
