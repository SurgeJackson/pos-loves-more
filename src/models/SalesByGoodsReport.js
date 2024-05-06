import {model, models, Schema} from "mongoose";

const SalesByGoodsReportSchema = new Schema({
  total: {type: Number},
  quantity: {type: Number },
  product: {type: String},
  category: {type: String},
});

export const SalesByGoodsReport = models?.salesByGoodsReport || model('salesByGoodsReport', SalesByGoodsReportSchema, 'salesByGoodsReport');