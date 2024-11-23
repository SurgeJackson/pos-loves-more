import {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
  userEmail: String,
  phone: String,
  streetAddress: String,
  postalCode: String,
  city: String,
  country: String,
  cartProducts: Object,
  paid: {type: Boolean, default: false},
  payCash: {type: Boolean, default: false},
  pos: Object,
  discount: {type: Number},
  discountAmount: {type: Number},
  promoDiscountAmount: {type: Number},
  promoCode: {type: Number},
  checked: {type: Boolean, default: false},
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);