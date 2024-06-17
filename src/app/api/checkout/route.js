import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Order} from "@/models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  const {cartProducts, address, payCash, pos, discount} = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const orderDiscount = discount ? discount : 0;
  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += p.basePrice;
  }

  let dist_discount = orderDiscount;
  for (const p of cartProducts) {
    let price_discount = Math.ceil(discount * (p.basePrice/subtotal));
    p.discount = price_discount > dist_discount ? dist_discount : price_discount;
    dist_discount -= p.discount;
  }

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    cartProducts,
    paid: false,
    payCash: payCash,
    pos: pos,
    discount: orderDiscount,
  });

  return Response.json(process.env.NEXTAUTH_URL + 'orders/' + orderDoc._id.toString() + '?clear-cart=1');
}