import mongoose from "mongoose";

const WCArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },   // meta description (≤160 chars)
    content: { type: String, required: true },   // Markdown
    imageUrl: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    tags: [{ type: String }],
    author: { type: String, default: "يلا شوت" },
    status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "PUBLISHED" },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.WCArticle ||
  mongoose.model("WCArticle", WCArticleSchema);
