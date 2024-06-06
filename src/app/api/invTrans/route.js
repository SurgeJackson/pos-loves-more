import {InvTrans} from "@/models/InvTrans";
import {Order} from "@/models/Order";

import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {getServerSession} from "next-auth";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);  
  const {pos, description, product, qty} = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const invTransDoc = await InvTrans.create({
    userEmail,
    pos,
    description,
    product,
    qty,
  });
  
  return Response.json(invTransDoc);
}

export async function GET(req) {
  const url = new URL(req.url);
  const pos = url.searchParams.get('pos');

  const agg = [
    {
      $match: {
        'pos._id': pos
      }
    },
    {
      $group: {
        _id: "$product._id",
        qty: {
          $sum: "$qty"
        }
      }
    },
    {
      $set: {
        id: '$_id'
      }
    },
    {
      $unset: ["_id"]
    },
  ];
  
  mongoose.connect(process.env.MONGO_URL);

  return Response.json( await InvTrans.aggregate(agg) );
}