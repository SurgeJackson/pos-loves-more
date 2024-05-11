import {useEffect, useState} from "react";

export default function SalesByGoodsReport({pos, reportDate}) {
  const [salesByGoodsReport, setSalesByGoodsReport] = useState([]);

  useEffect(() => {
    fetchSalesByGoodsReport(pos);
  }, [pos, reportDate]);


  function fetchSalesByGoodsReport(pos) {
    fetch('/api/salesByGoodsReport?date='+reportDate+'&pos='+pos).then(res => {
      res.json().then(salesByGoodsReport => setSalesByGoodsReport(salesByGoodsReport))
    });
  }

  return (
    <div className="flex flex-col gap-2 bg-gray-100 rounded-lg mb-2 px-4 py-2">
    {salesByGoodsReport.map(rep => (
      <div key={rep._id} className="flex flex-row gap-2 justify-items-center justify-between">
        <div className="w-full">{rep.product}</div>
        <div className="w-full">{rep.category}</div>
        <div className="text-right w-full">{rep.quantity}</div>
        <div className="text-right w-full">{(rep.total - rep.total_discount).toLocaleString()}&#8381;</div>
      </div>
    ))}
    </div>
  )
};


