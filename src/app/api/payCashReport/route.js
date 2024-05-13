import {Order} from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
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
      '$match': {
        'yearMonthDayUTC': {
          '$eq': date
        },
        'pos._id': pos
      }
    }, {
      '$unwind': {
        'path': '$cartProducts'
      }
    }, {
      '$group': {
        '_id': '$payCash', 
        'total_value': {
          '$sum': '$cartProducts.basePrice'
        }, 
        'total_discount': {
          '$sum': '$cartProducts.discount'
        }, 
        'quantity': {
          '$sum': 1
        }
      }
    }, {
      '$set': {
        'payCash': '$_id'
      }
    }, {
      '$unset': [
        '_id'
      ]
    }, {
      '$sort': {
        'payCash': 1
      }
    }
  ];
  mongoose.connect(process.env.MONGO_URL);

  return Response.json( await Order.aggregate(agg) );
}