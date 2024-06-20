import {isAdmin} from "@/app/api/auth/[...nextauth]/params";
import {Pos} from "@/models/Pos";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const {name} = await req.json();
  if (await isAdmin()) {
    const posDoc = await Pos.create({name});
    return Response.json(posDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const {_id, name} = await req.json();
  if (await isAdmin()) {
    await Pos.updateOne({_id}, {name});
  }
  return Response.json(true);
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  return Response.json(
    await Pos.find()
  );
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await Pos.deleteOne({_id});
  }
  return Response.json(true);
}