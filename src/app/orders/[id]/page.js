'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import CartProduct from "@/components/menu/CartProduct";
import {useParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import {dbTimeForHuman} from "@/libs/datetime";
import QRCode from "@/components/QRCode";

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
    <section className="mt-8 px-4">
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
        <div className="flex flex-col w-full">
          {order.cartProducts.map((product, index) => (
            <CartProduct key={index} product={product} />
            ))
          }
          <div className="flex items-center gap-2 py-1">
            <div className="grow">
              <h3 className="font-semibold">
                Итого:
              </h3>
            </div>
            <div className="text-black font-bold">
              {subtotal.toLocaleString()}&#8381;
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <div className="grow">
              <h3 className="font-semibold">
                Скидка:
              </h3>
            </div>
            <div className="text-black font-bold">
              {order.discount?.toLocaleString()}&#8381;
            </div>
          </div>

          <div className="flex items-center gap-2 border-b py-1">
            <div className="grow">
              <h3 className="font-semibold">
                Итого со скидкой:
              </h3>
            </div>
            <div className="text-black font-bold">
              {(subtotal - order?.discount).toLocaleString()}&#8381;
            </div>
          </div>
        </div>
      )}
      <div className="mt-4">
        <QRCode sum={subtotal - order?.discount} />
      </div>
    </section>
  );
}