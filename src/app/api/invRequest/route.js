import {InvRequest} from "@/models/InvRequest";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);  
  const {pos, product, isOpen} = await req.json();

  const invRequestDoc = await InvRequest.create({
    pos,
    product,
    isOpen
  });
  
  return Response.json(invRequestDoc);
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const {_id, ...data} = await req.json();
  
  const invRequestDoc = await InvRequest.findByIdAndUpdate(_id, data);

  return Response.json(true);
}

export async function GET(req) {
  const url = new URL(req.url);
  const pos = url.searchParams.get('pos');

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
      $match: {
        'pos._id': pos,
      //  'isOpen': true,
      }
    },
    { $sort: { createdAt: -1 } },
  ];
  
  mongoose.connect(process.env.MONGO_URL);

  return Response.json( await InvRequest.aggregate(agg) );
}