import {authOptions, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {Purchase} from "@/models/Purchase";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function GET(req) {
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  
  mongoose.connect(process.env.MONGO_URL);

  if (_id) {
    return Response.json( 
      await Purchase.findById(_id) 
    );
  }

  return Response.json(
    await Purchase.find()
  );
}

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  if (await isAdmin()) {
    const purchaseDoc = await Purchase.create(data);
    return Response.json(purchaseDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);

  const {_id, ...data} = await req.json();
  await Purchase.findByIdAndUpdate(_id, data);
  
  return Response.json(true);
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
//  if (await isAdmin()) {
    await Purchase.deleteOne({_id});
//  }
  return Response.json(true);
}