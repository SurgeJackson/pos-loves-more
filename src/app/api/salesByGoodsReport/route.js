import {SalesByGoodsReport} from "@/models/SalesByGoodsReport";
import mongoose from "mongoose";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  return Response.json( await SalesByGoodsReport.find() );
}