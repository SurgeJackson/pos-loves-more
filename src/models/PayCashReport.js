import {model, models, Schema} from "mongoose";

const PayCashReportSchema = new Schema({
  total_value: {type: Number},
  quantity: {type: Number },
  payCash: {type: Boolean},
});

export const PayCashReport = models?.payCashReport || model('payCashReport', PayCashReportSchema, 'payCashReport');