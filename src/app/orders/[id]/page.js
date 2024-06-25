'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import CartProduct from "@/components/layout/CartProduct";
import {useParams, useSearchParams} from "next/navigation";
import {useContext, useEffect} from "react";
import {dbTimeForHuman} from "@/lib/datetime";
import QRCode from "@/components/ui/QRCode";
import useSWR from 'swr';

export default function OrderPage() {
  const {clearCart} = useContext(CartContext);
  const {id} = useParams();
  const searchParams = useSearchParams();
  const clear = searchParams.get('clear-cart');
  const {data:order, isLoading:loadingOrder} = useSWR('/api/orders?_id='+id);

  useEffect(() => {
    if (clear) clearCart();
  }, []);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order?.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  return (
    <section className="mt-2 px-4">
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
          <div className="flex items-center gap-2 pb-1">
            <div className="grow font-semibold">
              Итого:
            </div>
            <div className="text-black font-bold">
              {subtotal.toLocaleString()}&#8381;
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <div className="grow font-semibold">
              Скидка:
            </div>
            <div className="text-black font-bold">
              {order.discount?.toLocaleString()}&#8381;
            </div>
          </div>

          <div className="flex items-center gap-2 border-b pb-1">
            <div className="grow font-semibold">
              Итого со скидкой:
            </div>
            <div className="text-black font-bold">
              {(subtotal - order?.discount).toLocaleString()}&#8381;
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 mx-auto">
        <QRCode sum={subtotal - order?.discount} />
      </div>
    </section>
  );
}