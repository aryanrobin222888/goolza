import mongoose from "mongoose";

const LiveMatchSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    matches: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.LiveMatch || mongoose.model("LiveMatch", LiveMatchSchema);
