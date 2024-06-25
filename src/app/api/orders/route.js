import {Order} from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req) {
  const url = new URL(req.url);

  mongoose.connect(process.env.MONGO_URL);

  const date = url.searchParams.get('date');
  const pos = url.searchParams.get('pos');
  const _id = url.searchParams.get('_id');

  const agg = [
    {
      '$addFields': {
        'yearMonthDayUTC': {
          '$dateToString': {
            'format': '%Y-%m-%d',
            'timezone': 'Europe/Moscow', 
            'date': '$createdAt'
          }
        }
      }
    }, {
      '$match': {
        'yearMonthDayUTC': {
          '$eq': date
        },
        'pos._id': pos
      }
    }
  ];

  if (_id) {
    return Response.json( await Order.findById(_id) );
  }

  
  return Response.json( await Order.aggregate(agg));
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);

  const {_id, ...data} = await req.json();
  await Order.findByIdAndUpdate(_id, data);
  
  return Response.json(true);
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  
  await Order.deleteOne({_id});
  
  return Response.json(true);
}