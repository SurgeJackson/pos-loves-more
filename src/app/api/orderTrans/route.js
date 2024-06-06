import {Order} from "@/models/Order";
import mongoose from "mongoose";

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
      $unwind: {
        path: '$cartProducts'
      }
    }, {
      $group: {
        _id: '$cartProducts._id', 
        qty: {
          $sum: -1
        }, 
      }
    },
    {
      $set: {
        id: '$_id'
      }
    },
    {
      $unset: [
        '_id'
      ]
    },
  ];
  
  mongoose.connect(process.env.MONGO_URL);

  return Response.json( await Order.aggregate(agg) );
}