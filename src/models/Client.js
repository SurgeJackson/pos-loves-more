import {model, models, Schema} from "mongoose";

const ClientSchema = new Schema({
  name: {type:String},
  promo: {type:Number},
  promo_percent: {type: Number},
  promo_active: {type: Boolean},
  c: Object,
  market: {type:String}
}, {timestamps: true});

export const Client = models?.Client || model('Client', ClientSchema);