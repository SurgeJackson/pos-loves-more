import {CartContext} from "@/components/AppContext";
import {cartProductPrice} from "@/components/AppContext";
import {useContext, useState} from "react";
import Switch from "@/components/ui/Switch";
import toast from "react-hot-toast";
import useSWR from 'swr';
import Check from "@/components/icons/Check";
import X from "@/components/icons/X";

import {cn} from "@/lib/utils";

export default function Footer() {
  const {cartProducts, removeCartProduct, pos} = useContext(CartContext);
  const [payCash, setPayCash] = useState(false);
  const [discount, setDiscount] = useState("");
  const [percentDiscount, setPercentDiscount] = useState(false);
  const [promoCode, setPromoCode] = useState(null);
  const [promoCodeAccepted, setPromoCodeAccepted] = useState(false);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  
  const {data:promo} = useSWR('/api/clients?_id=' + ((promoCode != null) ? promoCode : 0));
  
  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }

  let total = subtotal;

  percentDiscount ? subtotal = subtotal * ((100 - discount) / 100) : subtotal -= discount ? discount : 0;

  let discountAmount = total - subtotal;
  let promoDiscountAmount = 0;

  if (promoCodeDiscount) {
    promoDiscountAmount =  subtotal * ((promoCodeDiscount) / 100);
    subtotal = subtotal * ((100 - promoCodeDiscount) / 100);
  }

  let totalDiscount = total - subtotal;

  async function proceedToCheckout(ev) {
    ev.preventDefault();
    if (cartProducts?.length > 0) {
      const promise = new Promise((resolve, reject) => {
        fetch('/api/checkout', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            cartProducts,
            payCash,
            pos,
            totalDiscount,
            discountAmount,
            promoDiscountAmount,
            promoCode,
            promoCodeAccepted
          }),
        }).then(async (response) => {
          if (response.ok) {
            resolve();
            window.location = await response.json();
          } else {
            reject();
          }
        });
      });
  
      await toast.promise(promise, {
        loading: 'Preparing your order...',
        success: 'Redirecting to payment...',
        error: 'Something went wrong... Please try again later',
      })
    }
  }

  return (
    <footer className="flex flex-col bg-white bottom-0 sticky border-t p-2 gap-1 shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.1)]">
      <div className="flex flex-wrap justify-items-start gap-2">
        {cartProducts?.length > 0 && cartProducts.map((product, index) => (
          <div key={index} className="flex flex-col items-center border p-2 rounded-lg cursor-pointer w-14 shadow" onClick={() => removeCartProduct(index)} >
            <div className="text-xs font-extralight text-center text-clip">
              {product.name}
            </div>
            <div key={index} className="text-xs font-extralight text-center text-clip">
              {product.category.name}
            </div>
            <div className="text-xs font-extralight">
              {cartProductPrice(product).toLocaleString()}&#8381;
            </div>
          </div>
        ))}
      </div>
      {cartProducts?.length > 0 && (<>
      <Switch className="flex flex-row justify-end py-2" label={"Оплата наличными"} id="PayCash" onChange={ev => setPayCash(ev.target.checked)}/>

      <div className="flex flex-row gap-4">
        <input type="number" id="discount" name="discount" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={discount} placeholder="Скидка" onChange={ev => {setDiscount(ev.target.value);}}/>

        <Switch className="flex flex-row justify-end py-2 text-lg font-bold" label={"%"} id="PercentDiscount" checked={percentDiscount} onChange={ev => {setPercentDiscount(ev.target.checked);}}/>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <input type="text" id="coupon" name="coupon" className="w-full px-4 border border-gray-300 rounded-lg" placeholder="Промо код"
          onChange={ev => {
                setPromoCode(ev.target.value);
                setPromoCodeAccepted(false);
                setPromoCodeDiscount(0);
              }
              }/>
        {(promo?.promo == promoCode) && promoCode && (<>        
          <button disabled={promoCodeAccepted || !promo?.promo_active} type="button" className="p-2 w-10 h-10"
            onClick={() => {
                setPromoCodeAccepted(true);
                setPromoCodeDiscount(promo?.promo_percent);
              } }>
            {(promo?.promo_active) && (
              <Check className={cn("w-5 h-5", {"text-green-500": !promoCodeAccepted})}/>
            )}  
            {(!promo?.promo_active) && (
              <X className="w-5 h-5 text-red-500"/>
            )}
          </button>
          {(promo?.promo_active) && (
            <div className="grow">{promo?.promo_percent + "%"}</div>
          )}
        </>
        )}
      </div>
      </>
      )}

      <div onClick={proceedToCheckout} className={`cursor-pointer text-center rounded-lg max-w-auto p-4 text-sm ${cartProducts?.length > 0 ? "bg-primary text-white" : "text-body-color bg-gray-200 cursor-default"}`}>
        {cartProducts?.length > 0 ? `Оформить заказ ${cartProducts.length} шт, сумма ${subtotal.toLocaleString()}\u20BD` : "Начните выбирать товары"}
      </div>
    </footer>
  );
}