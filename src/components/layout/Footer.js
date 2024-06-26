import {CartContext} from "@/components/AppContext";
import {cartProductPrice} from "@/components/AppContext";
import {useContext, useState} from "react";
import Switch from "@/components/ui/Switch";
import toast from "react-hot-toast";

export default function Footer() {
  const {cartProducts, removeCartProduct, pos} = useContext(CartContext);
  const [payCash, setPayCash] = useState(false);
  const [discount, setDiscount] = useState();

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }
  subtotal -= discount ? discount : 0;

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
            discount,
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

      <input type="number" id="discount" name="discount" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={discount} placeholder="Скидка" onChange={ev => (setDiscount(ev.target.value))}/>

      <input type="text" id="coupon" name="coupon" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Промо код"/></>
      )}

      <div onClick={proceedToCheckout} className={`cursor-pointer text-center rounded-lg max-w-auto p-4 text-sm ${cartProducts?.length > 0 ? "bg-primary text-white" : "text-body-color bg-gray-200 cursor-default"}`}>
        {cartProducts?.length > 0 ? `Оформить заказ ${cartProducts.length} шт, сумма ${subtotal.toLocaleString()}\u20BD` : "Начните выбирать товары"}
      </div>
    </footer>
  );
}