import mongoose from "mongoose";

const SofaCacheSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    dataType: { type: String, required: true, enum: ["json", "binary"] },
    contentType: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export default mongoose.models.SofaCache || mongoose.model("SofaCache", SofaCacheSchema);
