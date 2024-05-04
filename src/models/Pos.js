import {model, models, Schema} from "mongoose";

const PosSchema = new Schema({
  name: {type:String, required:true},
}, {timestamps: true});

export const Pos = models?.Pos || model('Pos', PosSchema);