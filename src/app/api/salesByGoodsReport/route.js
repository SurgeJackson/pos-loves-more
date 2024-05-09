import {Order} from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
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
        }
      }
    }, {
        '$unwind': {
          'path': '$cartProducts'
        }
      }, {
        '$group': {
          '_id': '$cartProducts._id', 
          'product': {
            '$first': '$cartProducts.name'
          }, 
          'category': {
            '$first': '$cartProducts.category.name'
          }, 
          'quantity': {
            '$sum': 1
          }, 
          'total': {
            '$sum': '$cartProducts.basePrice'
          }, 
          'total_discount': {
            '$sum': '$cartProducts.discount'
          }
        }
      }, {
        '$unset': [
          'category_id', 'productObjectId'
        ]
      }, {
        '$sort': {
          'product': 1, 
          'cotegory': 1
        }
      }
  ];

  mongoose.connect(process.env.MONGO_URL);

  return Response.json( await Order.aggregate(agg) );
}