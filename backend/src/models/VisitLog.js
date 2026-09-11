import mongoose from "mongoose";

const visitLogSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.model("VisitLog", visitLogSchema);
