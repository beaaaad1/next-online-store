import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
    slug: string;
    title: string;
    date: Date;
    preview: string;
    content: string;
    imageUrl: string;
}

const ArticleSchema = new Schema<IArticle>({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    preview: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
});

const Article = (mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema)) as mongoose.Model<IArticle>;

export default Article;