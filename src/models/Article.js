import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  metaDescription: { type: String },
  socialCaption: { type: String },       // Short Arabic/Darija caption for Telegram & Facebook
  imageUrl: { type: String },            // High-res cover image URL for Google Discover + Telegram
  matchId: { type: String },
  tournamentId: { type: String },
  coverLogos: {
    home: { type: String },
    away: { type: String },
  },
  status: { type: String, default: "PUBLISHED" },
  telegramPosted: { type: Boolean, default: false }, // Track if sent to Telegram
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);
