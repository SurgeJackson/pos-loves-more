'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import CartProduct from "@/components/menu/CartProduct";
import {useParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import {dbTimeForHuman} from "@/libs/datetime";

export default function OrderPage() {
  const {clearCart} = useContext(CartContext);
  const [order, setOrder] = useState();
  const [loadingOrder, setLoadingOrder] = useState(true);
  const {id} = useParams();
  useEffect(() => {
    if (typeof window.console !== "undefined") {
      if (window.location.href.includes('clear-cart=1')) {
        clearCart();
      }
    }
    if (id) {
      setLoadingOrder(true);
      fetch('/api/orders?_id='+id).then(res => {
        res.json().then(orderData => {
          setOrder(orderData);
          setLoadingOrder(false);
        });
      })
    }
  }, []);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order?.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  return (
    <section className="max-w-4xl mx-auto mt-8">
      <div className="text-center">
        <h2 className="text-primary font-bold text-4xl italic">
          Заказ
        </h2>
        <h3 className="uppercase text-gray-500 font-semibold leading-4">
          {order && dbTimeForHuman(order?.createdAt)}
        </h3>
      </div>
      {loadingOrder && (
        <div>Загрузка заказа...</div>
      )}
      {order && (
        <div className="grid w-full">
         {order.cartProducts.map((product, index) => (
              <CartProduct key={index} product={product} />
            ))}
            <div className="text-right py-2 text-gray-500">
              Итого:
              <span className="text-black font-bold inline-block w-8">
                {subtotal.toLocaleString()}&#8381;
              </span>
            </div>
            <div className="text-right py-2 text-gray-500">
              Скидка:
              <span className="text-black font-bold inline-block w-8">
                {order.discount?.toLocaleString()}&#8381;
              </span>
            </div>
            <div className="text-right py-2 text-gray-500">
              Итого со скидкой:
              <span className="text-black font-bold inline-block w-8">
                {(subtotal - order.discount).toLocaleString()}&#8381;
              </span>
            </div>
        </div>
      )}
    </section>
  );
}