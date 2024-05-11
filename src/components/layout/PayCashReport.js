import {useEffect, useState} from "react";

export default function PayCashReport({pos, reportDate}) {
  const [payCashReport, setPayCashReport] = useState([]);

  useEffect(() => {
    fetchPayCashReport(pos);
  }, [pos, reportDate]);

  function fetchPayCashReport(pos) {
    fetch('/api/payCashReport?date='+reportDate+'&pos='+pos).then(res => {
      res.json().then(payCashReport => setPayCashReport(payCashReport))
    });
  }

  return (
    <div className="flex flex-col bg-gray-100 rounded-lg mb-2 px-4 py-2">

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
        <div className="p-1 rounded-md w-24 text-center text-base font-bold">
          Итого
        </div>
        <div className="text-center font-bold">
          {(payCashReport.reduce((tot, val) => tot + val.total_value - val.total_discount, 0 )).toLocaleString()}&#8381;
        </div>  
      </div>
    </div>
  )
};