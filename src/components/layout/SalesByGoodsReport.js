export default function SalesByGoodsReport({data}) {
  return (
    <div className="flex flex-col gap-2 bg-gray-100 rounded-lg mb-2 px-4 py-4">
    {data?.map(rep => (
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


