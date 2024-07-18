export default function PayCashReport({data}) {
  return (
    <div className="flex flex-col bg-gray-100 rounded-lg mb-2 py-2">
      {
        [...new Map(data?.map(item => [item['pos'], item])).values()].
          map((rep, index)=>(
            <div key={index} className="flex flex-row gap-2 py-2 px-1 justify-between">
              <div className='p-1 rounded-md text-left w-full text-xs truncate'>{rep.pos}</div>
              <div className="flex flex-row gap-2 justify-end">
                {data?.filter((item) => (item.pos == rep.pos)).map((item, index)=>(
                <div key={index} className={
                      (item.payCash ? 'bg-green-500' : 'bg-red-400')
                        + ' p-1 rounded-md text-white w-24 text-center text-sm'
                      }>
                      {(item.total_value-item.total_discount).toLocaleString()}&#8381;
                </div>
                ))}
                <div className='p-1 rounded-md w-24 text-right text-sm'>
                  {data?.filter((item) => (item.pos == rep.pos)).reduce((tot, val) => tot + val.total_value - val.total_discount, 0 )?.toLocaleString()}&#8381;
                </div>
              </div>
            </div>
        ))
      }
      
      <div className="flex flex-row gap-2 p-2 justify-between">
        <div className="p-1 rounded-md w-full text-left text-base font-bold">
          Итого
        </div>
        <div className="text-center font-bold">
          {(data?.reduce((tot, val) => tot + val.total_value - val.total_discount, 0 ))?.toLocaleString()}&#8381;
        </div>  
      </div>
    </div>
  )
};