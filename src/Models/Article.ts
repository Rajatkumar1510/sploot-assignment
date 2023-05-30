import { Document, model, ObjectId, Schema } from "mongoose";
const articalSchema = new Schema(
    {
        article_name: { type: String, require: true },
        owner: { type: Schema.Types.ObjectId, require: true },
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

export interface iArticle extends Document {
    article_name: String;
    owner: ObjectId
}

export default model<iArticle>("article", articalSchema);
