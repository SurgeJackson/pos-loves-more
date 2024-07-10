import {useState} from "react";
import Plus from "@/components/icons/Plus";
import Minus from "@/components/icons/Minus";
import BackSpace from "@/components/icons/BackSpace";
import CircleProgress from "@/components/icons/CircleProgress";

import { cn } from "@/lib/utils";

export default function QtyButton({className, label, item, isAdmin, onUpdate, onRequest, requested, requestedId}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [qty, setQty] = useState("0");
  
  const localeDecimalSeparator = (0.1.toLocaleString().replace(/\d/g, ''));
  let decimalSeparatorPosition = qty.indexOf(localeDecimalSeparator);

  let keyPad = [];
  for (let i = 1; i < 10; i++) {
    keyPad.push({key : i.toString(), content: i.toString()});
  }
  keyPad.push({key: localeDecimalSeparator, content:localeDecimalSeparator});
  keyPad.push({key: "0", content: "0"});
  keyPad.push({key: "<", content: <BackSpace className="w-8 h-8 m-auto"/>});

  function updateQty(q) {
    switch (q) {
      case localeDecimalSeparator :
        return (decimalSeparatorPosition < 0) ? setQty(qty.toString().concat(q)) : false;
      case "plus" :
        return (decimalSeparatorPosition < 0) ? setQty((Number(qty)+1).toString()) : false;
      case "minus" :
        return (decimalSeparatorPosition < 0) ? setQty((Number(qty)-1).toString()) : false;
      case "<" :
        return (qty.length == 1) ? setQty("0") : setQty((qty.toString().slice(0, -1)));
      default :  
        return (qty=="0") ? setQty(q.toString()) : setQty((qty.toString().concat(q.toString())));
    } 
  }

  function buttonEnabled(q) {
    switch (q) {
      case localeDecimalSeparator :
      case "plus" :
      case "minus" :  
        return (decimalSeparatorPosition < 0);
      case "<" :
      case "0" :
        return (qty != "0");        
      default :
        return true;
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center z-20" onClick={ev => ev.stopPropagation()}>
        <div className="flex flex-col bg-white rounded-lg">
          <div className="p-4 text-center text-xl">
            Изменить количество товара: {item.name}
          </div>
          <div className="flex items-center border-b">
            <div disabled={!buttonEnabled("minus")}
              className={cn(buttonEnabled("minus") ? "opacity-100 active:bg-gray-500" : "opacity-50 cursor-not-allowed", "border-none text-3xl w-1/6 p-4")} 
              onClick={ev => {updateQty("minus")}}>
              <Minus className="w-8 h-8 m-auto"/>
            </div>

             <input className="text-5xl text-center border-none pointer-events-auto focus:outline-none w-4/6" readOnly onChange={ev => {setQty(ev.target.value)}} value={qty}/>

            <div disabled={!buttonEnabled("plus")} 
              className={cn(buttonEnabled("plus") ? "opacity-100 active:bg-gray-500" : "opacity-50 cursor-not-allowed", "border-none text-3xl w-1/6 p-4")} 
              onClick={ev => {updateQty("plus")}}>
              <Plus className="w-8 h-8 m-auto"/>
            </div>
          </div>
          <div className="grid grid-cols-3">
            {keyPad.map((obj, index) => (
              <div key={index} disabled={!buttonEnabled(obj.key)} 
              className={cn(buttonEnabled(obj.key) ? "opacity-100 active:bg-gray-500" : "opacity-50 cursor-not-allowed", "text-xl font-medium rounded-none border-b border-r p-4 text-center")} 
              onClick={ev => {updateQty(obj.key)}}>{obj.content}</div>
            ))}
          </div>
          <div className="flex gap-2 mt-1 p-4">
            <button type="button" onClick={() => {setQty("0"); setShowConfirm(false)}}>
              Отмена
            </button>
            <button type="button" className="primary" onClick={() => {onUpdate(item, qty); setQty("0"); setShowConfirm(false);}}>
              Изменить
            </button>
            <button type="button" className="" onClick={() => {onRequest(item, requested); setShowConfirm(false);}}>
              {requested?.isOpen ? `Подтвердить POS` : `Запросить POS`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAdmin && (<CircleProgress
        progress={
          requested?.yearMonthDayUTC ? Math.round((new Date().getTime() - new Date(requested?.yearMonthDayUTC).getTime()) / (24 * 1000 * 3600))* 100 / 7 : 100
        }
        checked={requested?.isOpen}
        className={"absolute -top-0.5 -right-0.5 w-8 h-8 -rotate-90"}
      />)}
      <button className={cn(((label <= 5) || (!label)) ? "bg-primary text-white" : label <= 20 ? "bg-yellow-400" : "bg-green-500", className)} type="button"
        onClick={ev => {setShowConfirm(isAdmin); ev.stopPropagation();}}>
        {label}
      </button>
    </>
  );
}