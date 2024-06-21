'use client';
import {useEffect, useState, useContext} from "react";
import {useProfile} from "@/components/UseProfile";
import {CartContext, getCurrentDate} from "@/components/AppContext";
import PayCashReport from "@/components/layout/PayCashReport";
import SalesByGoodsReport from "@/components/layout/SalesByGoodsReport";

import Trash from "@/components/icons/Trash";
import Check from "@/components/icons/Check";
import View from "@/components/icons/View";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

export default function OrdersPage() {
  const {pos} = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [poses, setPoses] = useState([]);
  const [uPos, setUPos] = useState();
  const [reportDate, setReportDate] = useState(getCurrentDate("-"));
  const {data:user, loading:profileFetched} = useProfile();
  const router = useRouter();

  useEffect(() => {
    const ps = uPos ? uPos : JSON.parse(localStorage.getItem("pos"))._id;
    setUPos(ps);
    fetchPoses();
    fetchOrders(ps);
  }, [reportDate, uPos]);

  function fetchPoses() {
    fetch('/api/pos').then(res => {
      res.json().then(poses => {
        setPoses(poses);
      });
    });
  }

  function fetchOrders(pos) {
    setLoadingOrders(true);
    fetch('/api/orders?date='+reportDate+'&pos='+pos).then(res => {
      res.json().then(orders => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      })
    })
  }

  async function handleCheckClick(_id, uPos) {
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = {_id:_id};
      if (_id) {
        data.checked = true;
      }
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchOrders(uPos);
      if (response.ok)
        resolve();
      else
        reject();
    });
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/orders?_id='+_id, {
        method: 'DELETE',
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: 'Удаление заказа...',
      success: 'Заказ удален',
      error: 'Ошибка при удалении',
    });

    fetchOrders(uPos);
  }

  function handleViewClick(_id) {
    router.push('/orders/' + _id);
  }

  if (profileFetched) {
    return 'Loading...';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <input type="date" id="reportDate" name="reportDate" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={reportDate} placeholder="Дата" onChange={ev => (setReportDate(ev.target.value))}/>

        <select id="uPos" name="uPos" value={uPos ? uPos : pos._id} onChange={ev => setUPos(ev.target.value)}>
          {poses?.length > 0 && poses.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      
      <PayCashReport pos={uPos ? uPos : pos._id} reportDate={reportDate} reLoad={loadingOrders}/>

      <div className="mt-2 flex flex-col">
        {loadingOrders && (
          <div>Загрузка заказов...</div>
        )}
        {orders?.length > 0 && orders.map(order => (
        <div key={order._id} className="bg-gray-100 mb-2 p-2 rounded-lg grid grid-cols-4  items-center justify-center gap-2">
          <div className="flex flex-col gap-1 items-start mb-1">
            <div className="text-xs truncate w-full">{order.userEmail}</div>
            <div className="text-xs">{order.pos.name}</div>
            <div className="text-gray-500 text-xs">{new Date(Date.parse(order.createdAt)).toLocaleString()}</div>
          </div>
          <div className="text-gray-500 text-xs text-center w-full text-wrap">
            {order.cartProducts.map((product) => (
              <p className="truncate">
                {product.name + '(' + product.category.name + ') '}
              </p>
            ))}
          </div>
          <div className="text-center w-full">
            {(order.cartProducts.reduce(function(tot, arr) {return tot + arr.basePrice},0) - order.discount).toLocaleString()}&#8381;    
            <div className={
              (order.payCash ? 'bg-green-500' : 'bg-red-400')
              + ' p-1 rounded-md text-white w-24 text-center text-sm w-full'}>
                {order.payCash ? 'Наличные' : 'Карта'}
            </div>
          </div>
          <div className="text-right flex flex-wrap justify-center gap-1 w-full">
            <button
              type="button"
              onClick={() => { handleViewClick(order._id) } }
              className="p-2 w-10 h-10">
              <View className="w-5 h-5"/>
            </button>
          {(!order.checked || user.admin) && (
            <button
              type="button"
              onClick={() => { 
                if (window.confirm('Удалить заказ?')) handleDeleteClick(order._id)
              } }
              className="p-2 w-10 h-10">
              <Trash className="w-5 h-5"/>
            </button>
          )}
          {!order.checked && (
            <button
              type="button"
              onClick={() => {handleCheckClick(order._id, uPos) } }
              className="p-2 w-10 h-10">
              <Check className="text-green-500 w-5 h-5"/>
            </button>
          )}
          </div>
        </div>
        ))}
      </div>

      <SalesByGoodsReport pos={uPos ? uPos : pos._id} reportDate={reportDate} reLoad={loadingOrders}/>
    </section>
  );
}