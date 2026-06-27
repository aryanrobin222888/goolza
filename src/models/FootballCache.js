import mongoose from "mongoose";

const FootballCacheSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Add TTL index
FootballCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.FootballCache || mongoose.model("FootballCache", FootballCacheSchema);
