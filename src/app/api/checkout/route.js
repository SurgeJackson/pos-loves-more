import {authOptions} from "@/app/api/auth/[...nextauth]/params";
import {Order} from "@/models/Order";
import {Client} from "@/models/Client";

import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  const {cartProducts, payCash, pos, totalDiscount, discountAmount, promoDiscountAmount, promoCode, promoCodeAccepted} = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const orderDiscount = totalDiscount ? totalDiscount : 0;
  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += p.basePrice;
  }

  let dist_discount = orderDiscount;
  for (const p of cartProducts) {
    let price_discount = Math.ceil(orderDiscount * (p.basePrice/subtotal));
    p.discount = price_discount > dist_discount ? dist_discount : price_discount;
    dist_discount -= p.discount;
  }

  const orderDoc = await Order.create({
    userEmail,
    cartProducts,
    paid: false,
    payCash: payCash,
    pos: pos,
    discount: orderDiscount,
    promoCode: promoCodeAccepted ? promoCode : 0,
    discountAmount: discountAmount,
    promoDiscountAmount: promoDiscountAmount
  });

  if (promoCodeAccepted) {
    const clientDoc = await Client.updateOne({promo: promoCode}, {promo_active: false});
  }

  return Response.json(process.env.NEXTAUTH_URL + '/orders/' + orderDoc._id.toString() + '?clear-cart=1');
}