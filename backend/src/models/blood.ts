import mongoose from "mongoose";
import { BloodType } from "../shared/types";

const bloodSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  date: { type: Date, required: true },
  hemoglobin: Number,
  wbc: Number,
  platelets: Number,
  glucose: Number,
  cholesterolTotal: Number,
});

const Blood = mongoose.model<BloodType>("Blood", bloodSchema);

export default Blood;
