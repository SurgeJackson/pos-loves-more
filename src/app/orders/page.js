'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import {dbTimeForHuman} from "@/libs/datetime";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const {loading, data:profile} = useProfile();
  const [payCashReport, setPayCashReport] = useState([]);
  const [salesByGoodsReport, setSalesByGoodsReport] = useState([]);

  useEffect(() => {
    fetchOrders();
    
    fetch('/api/payCashReport').then(res => {
      res.json().then(payCashReport => setPayCashReport(payCashReport))
    });

    fetch('/api/salesByGoodsReport').then(res => {
      res.json().then(salesByGoodsReport => setSalesByGoodsReport(salesByGoodsReport))
    });
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders').then(res => {
      res.json().then(orders => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      })
    })
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      {/* <UserTabs isAdmin={profile.admin} /> */}
      <div className="mt-8">
        {loadingOrders && (
          <div>Загрузка заказов...</div>
        )}
        {orders?.length > 0 && orders.map(order => (
        <div key={order._id} className="bg-gray-100 mb-2 px-4 py-2 rounded-lg flex flex-row justify-between items-start gap-2">
          <div className="flex flex-col gap-1 items-center mb-1">
            <div className="text-sm text-center">{order.userEmail}<br/>{order.pos.name}
            </div>
            <div className="text-gray-500 text-sm">{dbTimeForHuman(order.createdAt)}</div>
          </div>
          <div className="text-gray-500 text-xs text-center">
          {order.cartProducts.map((product) => (
              product.name + '(' + product.category.name + ') '
          ))}
          </div>
          <div className="text-center">
            {order.cartProducts.reduce(function(tot, arr) {return tot + arr.basePrice},0).toLocaleString()}&#8381;    
            <div className={
              (order.payCash ? 'bg-green-500' : 'bg-red-400')
              + ' p-1 rounded-md text-white w-24 text-center text-sm'}>
                {order.payCash ? 'Наличные' : 'Карта'}
            </div>
          </div>
          {/* <div className="justify-end flex gap-2 items-center whitespace-nowrap">
            <Link href={"/orders/"+order._id} className="button">
              Открыть заказ
            </Link>
          </div> */}
        </div>
        ))}
      </div>
      {payCashReport.map((rep, index) => (
        <div key={index} className="flex flex-row gap-2 p-2 justify-between">
          <div className={
            (rep.payCash ? 'bg-green-500' : 'bg-red-400')
              + ' p-1 rounded-md text-white w-24 text-center text-sm'
            }>
            {rep.payCash ? 'Наличные' : 'Карта'}
          </div>
          <div className="text-center">
            {rep.total_value.toLocaleString()}&#8381;
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-2 p-2">
      {salesByGoodsReport.map(rep => (
        <div key={rep._id} className="flex flex-row gap-2 justify-items-center justify-between">
          <div className="w-full">{rep.product}</div>
          <div className="w-full">{rep.category}</div>
          <div className="text-right w-full">{rep.quantity}</div>
          <div className="text-right w-full">{rep.total.toLocaleString()}&#8381;</div>
        </div>
      ))}
      </div>
    </section>
  );
}