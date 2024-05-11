import {authOptions, isAdmin} from "@/app/api/auth/[...nextauth]/route";
import {Order} from "@/models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function GET(req) {
  const url = new URL(req.url);

  mongoose.connect(process.env.MONGO_URL);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();
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

  if (admin) {
    return Response.json( await Order.aggregate(agg));
  }

  if (userEmail) {
    return Response.json( await Order.find({userEmail}) );
  }

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
//  if (await isAdmin()) {
    await Order.deleteOne({_id});
//  }
  return Response.json(true);
}