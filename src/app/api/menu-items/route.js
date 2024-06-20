import {isAdmin} from "@/app/api/auth/[...nextauth]/params";
import {MenuItem} from "../../../models/MenuItem";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  if (await isAdmin()) {
    const menuItemDoc = await MenuItem.create(data);
    return Response.json(menuItemDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  if (await isAdmin()) {
    const {_id, ...data} = await req.json();
    await MenuItem.findByIdAndUpdate(_id, data);
  }
  return Response.json(true);
}

export async function GET(req) {
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  
  mongoose.connect(process.env.MONGO_URL);

  if (_id) {
    return Response.json( 
      await MenuItem.findById(_id) 
    );
  }

  return Response.json(
    await MenuItem.find().populate("category")
  );
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await MenuItem.deleteOne({_id});
  }
  return Response.json(true);
}