import {isAdmin} from "@/app/api/auth/[...nextauth]/params";
import {Client} from "@/models/Client";
import mongoose from "mongoose";

export async function GET(req) {
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');

    mongoose.connect(process.env.MONGO_URL);

    if (_id) {
      return Response.json(await Client.findOne({ promo: _id }));
    } else 
    {
      console.log('TEST');
      return Response.json({});
    }
  }