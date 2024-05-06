'use client';
import {CartContext} from "@/components/AppContext";
import {cartProductPrice} from "@/components/AppContext";
import ShoppingCart from "@/components/icons/ShoppingCart";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useContext, useState} from "react";
import Switch from "@/components/menu/Switch";
import toast from "react-hot-toast";

export default function Footer() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const {cartProducts,removeCartProduct, pos} = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [payCash, setPayCash] = useState(false);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();
    // address and shopping cart products

    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          //address,
          cartProducts,
          payCash,
          pos
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

  return (
    <footer className="flex flex-col bg-white bottom-0 sticky border-t p-2 gap-1 shadow-[0_-5px_5px_-5px_rgba(0,0,0,0.1)]">
      <div className="flex flex-wrap justify-items-start gap-2">
        {cartProducts?.length > 0 && cartProducts.map((product, index) => (
          <div key={index} className="flex flex-col items-center border p-2 rounded-lg cursor-pointer w-14 shadow" onClick={() => removeCartProduct(index)} >
            <div className="text-xs font-extralight">
              {product.name}
            </div>
            <div key={index} className="text-xs font-extralight">
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
      <input type="text" id="coupon" name="coupon" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Промо код"/></>
      )}
      <div onClick={proceedToCheckout} className={`cursor-pointer text-center rounded-lg max-w-auto p-4 text-sm ${cartProducts?.length > 0 ? "bg-primary text-white" : "text-body-color bg-gray-200 cursor-default"}`}>
        {cartProducts?.length > 0 ? `Оформить заказ ${cartProducts.length} шт, сумма ${subtotal.toLocaleString()}\u20BD` : "Начните выбирать товары"}
      </div>
    </footer>
  );
}