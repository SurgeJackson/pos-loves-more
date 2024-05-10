'use client';
import {useProfile} from "@/components/UseProfile";
import {useEffect, useState} from "react";
import {getCurrentDate} from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import Check from "@/components/icons/Check";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const {loading, data:profile} = useProfile();
  const [payCashReport, setPayCashReport] = useState([]);
  const [salesByGoodsReport, setSalesByGoodsReport] = useState([]);
  const [reportDate, setReportDate] = useState(getCurrentDate("-"));

  useEffect(() => {
    fetchOrders();
    fetchPayCashReport();
    fetchSalesByGoodsReport();
  }, [reportDate]);

  function fetchPayCashReport() {
    fetch('/api/payCashReport?date='+reportDate).then(res => {
      res.json().then(payCashReport => setPayCashReport(payCashReport))
    });
  }

  function fetchSalesByGoodsReport() {
    fetch('/api/salesByGoodsReport?date='+reportDate).then(res => {
      res.json().then(salesByGoodsReport => setSalesByGoodsReport(salesByGoodsReport))
    });
  }

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders?date='+reportDate).then(res => {
      res.json().then(orders => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      })
    })
  }

 
  async function handleCheckClick(_id) {
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
      fetchOrders();
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

    fetchOrders();
    fetchSalesByGoodsReport();
    fetchPayCashReport();
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto w-full">
      <input type="date" id="reportDate" name="reportDate" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={reportDate} placeholder="Дата" onChange={ev => (setReportDate(ev.target.value))}/>
      <div className="mt-8">
        {loadingOrders && (
          <div>Загрузка заказов...</div>
        )}
        {orders?.length > 0 && orders.map(order => (
        <div key={order._id} className="bg-gray-100 mb-2 px-4 py-2 rounded-lg flex flex-row justify-around items-start gap-2">
          <div className="flex flex-col gap-1 items-start mb-1 w-1/4">
            <div className="text-xs truncate w-full">{order.userEmail}
            </div>
            <div className="text-xs">{order.pos.name}</div>
            <div className="text-gray-500 text-xs">{new Date(Date.parse(order.createdAt)).toLocaleString()}</div>
          </div>
          <div className="text-gray-500 text-xs text-center w-1/2">
          {order.cartProducts.map((product) => (
              product.name + '(' + product.category.name + ') '
          ))}
          </div>
          <div className="text-center w-1/4">
            {(order.cartProducts.reduce(function(tot, arr) {return tot + arr.basePrice},0) - order.discount).toLocaleString()}&#8381;    
            <div className={
              (order.payCash ? 'bg-green-500' : 'bg-red-400')
              + ' p-1 rounded-md text-white w-24 text-center text-sm'}>
                {order.payCash ? 'Наличные' : 'Карта'}
            </div>
          </div>
          <div className="text-right w-1/4">
          {!order.checked && (
            <button
              type="button"
              onClick={() => { 
                if (window.confirm('Удалить заказ?')) handleDeleteClick(order._id)
              } }
              className="p-2">
              <Trash />
            </button>
          )}
          {!order.checked && (
            <button
              type="button"
              onClick={() => {handleCheckClick(order._id) } }
              className="p-2">
              <Check className="text-green-500 w-8 h-8"/>
            </button>
          )}
          </div>
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
            {(rep.total_value-rep.total_discount).toLocaleString()}&#8381;
          </div>
        </div>
      ))}
      <div className="flex flex-row gap-2 p-2 justify-between">
        <div className="p-1 rounded-md w-24 text-center text-sm">
          Итого
        </div>
        <div className="text-center">
          {(payCashReport.reduce((tot, val) => tot + val.total_value - val.total_discount, 0 )).toLocaleString()}&#8381;
        </div>  
      </div>
      <div className="flex flex-col gap-2 p-2">
      {salesByGoodsReport.map(rep => (
        <div key={rep._id} className="flex flex-row gap-2 justify-items-center justify-between">
          <div className="w-full">{rep.product}</div>
          <div className="w-full">{rep.category}</div>
          <div className="text-right w-full">{rep.quantity}</div>
          <div className="text-right w-full">{(rep.total - rep.total_discount).toLocaleString()}&#8381;</div>
        </div>
      ))}
      </div>
      {/* <div onClick={test} className="cursor-pointer text-center rounded-lg max-w-auto p-4 text-sm bg-primary text-white">
        TEST
      </div> */}
    </section>
  );
}