import mongoose, {model, models, Schema} from "mongoose";

const PurchaseSchema = new Schema({
  pos: Object,
  userEmail: String,
  description: {type: String},
  purchaseProducts: Object,
}, {timestamps: true});

export const Purchase = models?.Purchase || model('Purchase', PurchaseSchema);