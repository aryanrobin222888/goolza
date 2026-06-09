import mongoose from "mongoose";

const SiteArticleSchema = new mongoose.Schema(
  {
    site: {
      type: String,
      required: true,
      enum: ["goolza", "yallashoot", "koora-live-stream", "yallashoot-live"],
      index: true,
    },
    title:     { type: String, required: true },
    slug:      { type: String, required: true },
    excerpt:   { type: String, required: true },
    content:   { type: String, required: true },
    imageUrl:  { type: String, default: "" },
    imageAlt:  { type: String, default: "" },
    tags:      [{ type: String }],
    author:    { type: String, default: "يلا شوت" },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "PUBLISHED",
    },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound unique index: slug unique per site
SiteArticleSchema.index({ site: 1, slug: 1 }, { unique: true });

export default mongoose.models.SiteArticle ||
  mongoose.model("SiteArticle", SiteArticleSchema);
