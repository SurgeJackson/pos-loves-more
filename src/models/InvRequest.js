import {model, models, Schema} from "mongoose";

const InvRequestSchema = new Schema({
  pos: Object,
  product: {type: Object},
  isOpen: {type: Boolean},
}, {timestamps: true});

export const InvRequest = models?.InvRequest || model('InvRequest', InvRequestSchema);