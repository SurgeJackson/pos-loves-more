import {model, models, Schema} from "mongoose";

const InvTransSchema = new Schema({
  userEmail: {type: String},
  pos: Object,
  description: {type: String},
  product: {type: Object},
  qty: {type: Number},
}, {timestamps: true});

export const InvTrans = models?.InvTrans || model('InvTrans', InvTransSchema);