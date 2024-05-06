import {PayCashReport} from "@/models/PayCashReport";
import mongoose from "mongoose";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  return Response.json( await PayCashReport.find() );
}